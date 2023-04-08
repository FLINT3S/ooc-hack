from fastapi import APIRouter, HTTPException

from src.auth import Auth
from src.services.objects.loginrest import LoginRest
from src.services.strapi.database import get_entity

auth_router = APIRouter()


@auth_router.post("/login")
async def login(login_rest: LoginRest):
    auth = Auth()
    strapi_client = await get_entity(collection="clients", field="email", value=login_rest.email)
    if strapi_client is None:
        return HTTPException(status_code=401, detail='Invalid email')
    if not auth.verify_password(login_rest.password, strapi_client["attributes"]["passwordHash"]):
        return HTTPException(status_code=401, detail='Invalid password')

    access_token = auth.create_token(login_rest.email)
    refresh_token = auth.create_refresh_token(login_rest.email)

    return {"access_token": access_token, "refresh_token": refresh_token,
            "apiKey": strapi_client["attributes"]["apiKey"]}
