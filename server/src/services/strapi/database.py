import asyncio
import os
from strapi_client import StrapiClient
from models import User, RealEstateAttachment, RealEstate, Role, TaskAttachment, Task

strapi_url = "https://2198-178-71-66-26.eu.ngrok.io/"
login = "ooc-hack@flint3s.ru"
password = "Sadness9-Judiciary-Fraternal"


# strapi_url = os.environ['STRAPI_URL']
# login = os.environ['STRAPI_LOGIN']
# password = os.environ['STRAPI_PASSWORD']

async def update_entity(collection, object_id, data):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    await strapi.update_entry(collection, object_id, data=data)


async def create_entity(collection, data):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    await strapi.create_entry(collection, data)


async def get_entity(collection, field, value):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    try:
        data = await strapi.get_entries(collection, filters={field: {'$eq': value}})
        data = data["data"]
        if data:
            return data[0]
        return None
    except Exception as e:
        return "Wrong collection or field"


async def get_user(email=None, id=None):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    try:
        if email:
            data = await strapi.get_entries("clients", filters={"email": {'$eq': email}})
        elif id:
            data = await strapi.get_entries("clients", filters={"id": {'$eq': id}})
        else:
            return None
        data = data["data"]
        if data:
            # Т.к. id хранится отдельно, а атрибуты отдельно в одном словаре, то надо объединить в data[0]
            data[0] = data[0] | data[0]["attributes"]
            del data[0]["attributes"]
            # -----------------------------------
            return User(**data[0])
        return None
    except Exception as e:
        print("Wrong collection or field")
        return None

async def get_entity_id(collection, field, value):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    data = await strapi.get_entries(collection, filters={field: {'$eq': value}})
    data = data["data"]
    if data:
        return data[0]["id"]
    return None


if __name__ == "__main__":
    # asyncio.run(create_entity(collection="tests", data={"test": "vasya_loh"}))
    test_user = asyncio.run(get_user(email="tv.kozlov.2002@gmail.com"))
    print(test_user)
    print(test_user.email)
    # object_id = asyncio.run(get_entity_id(collection="tests", field="test", value="vasya_loh"))
    # if object_id:
    #     asyncio.run(update_entity(collection="tests", object_id=object_id, data={"test": "aaaaaa"}))
