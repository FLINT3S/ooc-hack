# -*- coding: utf-8 -*-
from fastapi import FastAPI, Body
from starlette.middleware.cors import CORSMiddleware

import uvicorn
from pydantic import BaseModel

from urllib.parse import unquote

import json

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
async def root(data = Body()):
    print("фыафыа))123")
    # print(data.json())
    data = data.decode('utf-8')
    data = (unquote(data))[8:]
    print(json.loads(data))
    # print(json.loads(data.decode('utf8')))
    return {"message": "Notif!"}


if __name__ == "__main__":
    uvicorn.run("main:app", port=3002, reload=True, workers=1)
