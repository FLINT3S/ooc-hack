# -*- coding: utf-8 -*-
import json
import uvicorn

import dateutil.parser
from datetime import datetime
from fastapi import FastAPI, Body
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import unquote

from .database import get_meeting, get_users_from_working_group, get_task, create_notification
from notifications.src.telegram_bot.bot import bot
from aiogram.utils.exceptions import ChatIdIsEmpty

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Data(BaseModel):
    data: str


@app.post("/notifications/new_notification/")
async def root(data=Body()):
    data = data.decode('utf-8')  # bytes to str
    data = (unquote(data))[8:]  # url string to string and slice key "payload="
    data = json.loads(data)  # str to json
    print(data)
    if data["model"] == "meeting" and data["event"] == "entry.create":  # Уведомление при создании новой встречи
        meeting_info = await get_meeting(data["entry"]["id"])
        print(meeting_info)
        meeting_date = dateutil.parser.isoparse(meeting_info["attributes"]["date"])
        meeting_url = meeting_info["attributes"]["url"]
        for task in meeting_info["attributes"]["tasks"]["data"]:
            task = await get_task(task["id"])
            if task["attributes"]["workGroups"]["data"]:
                for work_group in task["attributes"]["workGroups"]["data"]:
                    work_group = await get_users_from_working_group(work_group["id"])
                    text = f"Назначена встреча по теме [{task['attributes']['title']}]" \
                           f" {meeting_date.strftime('%d.%m.%y в %H:%M')}" \
                           f"\nСсылка для подключения: {meeting_url}"
                    await create_notification({
                        "workGroup": work_group,
                        "title": "New meeting",
                        "text": text,
                        "date": datetime.now().strftime('%d.%m.%y в %H:%M'),
                        "sent": True
                    })
                    for client in work_group["attributes"]["clients"]["data"]: # Send message in Telegram
                        await bot.send_message(client["attributes"]["telegramId"], text)
    elif data["model"] == "task" and data["event"] == "entry.update":
        text = f"Обновлён статус решения \"{data['entry']['title']}\" на \"{data['entry']['status']}\""
        task = await get_task(data["entry"]["id"])
        if task["attributes"]["workGroups"]["data"]:
            for work_group in task["attributes"]["workGroups"]["data"]:
                work_group = await get_users_from_working_group(work_group["id"])
                await create_notification({
                    "workGroup": work_group,
                    "title": "Task status changed",
                    "text": text,
                    "date": datetime.now().strftime('%d.%m.%y в %H:%M'),
                    "sent": True
                })
                for client in work_group["attributes"]["clients"]["data"]:  # Send message in Telegram
                    try:
                        await bot.send_message(client["attributes"]["telegramId"], text)
                    except ChatIdIsEmpty as e:
                        print("У пользователя нет telegramId")
                        print(e)


if __name__ == "__main__":
    uvicorn.run("main:app", port=3002, reload=True, workers=1)
