import xmltodict
from fastapi import APIRouter, UploadFile, File
from typing import Annotated

from server.src.services.inputs.dtos import RealEstate
from server.src.services.strapi.database import create_entity

input_router = APIRouter()


@input_router.post("/xml")
async def add_xml_object(file: Annotated[UploadFile, File()]):
    file_content = file.file
    parsed_xml = xmltodict.parse(file_content)
    real_estate_dto = RealEstate.parse_obj(parsed_xml["root"])
    return await add_json_object(real_estate_dto)


@input_router.post("/json")
async def add_json_object(real_estate_json: RealEstate):
    real_estate = real_estate_json.dict()
    await create_entity("real-estates", real_estate)
    return "Ok"
