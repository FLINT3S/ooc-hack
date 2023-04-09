import requests as requests_send
from fastapi import APIRouter, Request

notifications_router = APIRouter()


base_url = "https://585c-185-26-73-71.ngrok-free.app"


@notifications_router.post("/new_notification")
async def new_meeting(request: Request):
    payload = await request.body()
    requests_send.post(base_url + "/notifications/new_notification", data={"payload": payload})
    return {"status": "OK"}
