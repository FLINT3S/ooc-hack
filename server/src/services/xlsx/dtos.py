from pydantic import BaseModel


class ReportGeneratorDto(BaseModel):
    realtyIds: list[int]
    reportSettings: dict[str, bool]
