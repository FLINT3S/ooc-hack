from fastapi import APIRouter, UploadFile, File
from typing import Annotated

input_router = APIRouter()


@input_router.post("/xml")
async def add_xml_object(file: Annotated[UploadFile, File()]):
    print(file.size)
