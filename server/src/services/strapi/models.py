from datetime import datetime

from pydantic import BaseModel


class Role(BaseModel):
    id: int
    title: str


class User(BaseModel):
    id: int
    name: str
    surname: str
    email: str
    role: str
    updatedAt: datetime = datetime.now()
    createdAt: datetime = datetime.now()
    passwordHash: str
    telegramId: str
    apiKey: str


class RealEstate(BaseModel):
    id: int
    federal_district: str
    region: str
    address: str
    type: str
    state: str
    area: str
    owner: str
    actual_user_id: int


class RealEstateAttachment(BaseModel):
    id: int
    real_estate_id: int
    link: str


class Task(BaseModel):
    id: int
    description: str
    created_at: datetime = datetime.now()
    deadline: datetime
    assignee_id: int
    creator_id: int
    real_estate_id: int


class TaskAttachment(BaseModel):
    id: int
    task_id: int
    link: str
