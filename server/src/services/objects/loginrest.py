from pydantic import BaseModel


class LoginRest(BaseModel):
    email: str
    password: str
