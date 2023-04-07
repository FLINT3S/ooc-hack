import asyncio
import os
from strapi_client import StrapiClient

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
    data = await strapi.get_entries(collection, filters={field: {'$eq': value}})
    data = data["data"]
    if data:
        return data[0]
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
    test_object = asyncio.run(get_entity(collection="tests", field="test", value="vasya_loh"))
    print(test_object)
    object_id = asyncio.run(get_entity_id(collection="tests", field="test", value="vasya_loh"))
    if object_id:
        asyncio.run(update_entity(collection="tests", object_id=object_id, data={"test": "aaaaaa"}))
