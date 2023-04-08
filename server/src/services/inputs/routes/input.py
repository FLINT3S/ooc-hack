import json

import xmltodict
from fastapi import APIRouter, UploadFile, File
from typing import Annotated

from server.src.services.strapi.database import create_entity

input_router = APIRouter()


@input_router.post("/xml")
async def add_xml_object(file: Annotated[UploadFile, File()]):
    file_content = file.file
    parsed_xml = xmltodict.parse(file_content)
    json_obj = json.dumps(parsed_xml["root"])
    return await add_json_object(json_obj)


@input_router.post("/json")
async def add_json_object(real_estate_json: str):
    real_estate = json.loads(real_estate_json)
    await create_entity("real-estates", real_estate)
    return "Ok"
