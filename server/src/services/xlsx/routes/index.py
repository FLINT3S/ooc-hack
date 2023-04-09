from fastapi import APIRouter, Response

from ..dtos import ReportGeneratorDto
from ..xlsx_output import XlsxWriter
from ...strapi.database import *

xlsx_router = APIRouter()


@xlsx_router.get("/")
async def index():
    return {"status": "OK"}


@xlsx_router.post("/generate")
async def generate_report(real_estate_ids: ReportGeneratorDto):
    tasks = []
    for real_estate_id in real_estate_ids.realtyIds:
        real_estate = await get_real_estate_with_tasks(real_estate_id)
        estate_tasks = real_estate.pop('tasks')
        for estate_task in estate_tasks:
            estate_task["realEstate"] = real_estate
            tasks.append(estate_task)

    xlsx_output = XlsxWriter(real_estate_ids.reportSettings)
    xlsx_output.generate_tasks(tasks)
    xlsx_output.save('a.xlsx')

    return Response("Ok")
