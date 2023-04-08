from fastapi import APIRouter, Response

from ...strapi.database import *

xlsx_router = APIRouter()


@xlsx_router.get("/")
async def index():
    return {"status": "OK"}


@xlsx_router.post("/generate")
async def generate_subpoena(ids: list[int]):
    entities = []
    for task_id in ids:
        entities.append(await get_entity("tasks", "id", task_id))
    return Response("Ok")
