from pydantic import BaseModel


class RealEstate(BaseModel):
    federalDistrict: str
    region: str
    address: str
    objectState: str
    area: str
    owner: str
    actualUser: str
    attachments: list | None
    buildingType: int | None
    additionalFields: dict
    tasks: list | None
