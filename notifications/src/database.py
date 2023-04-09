import os
from strapi_client import StrapiClient

strapi_url = "https://ea12-178-71-66-26.ngrok-free.app/"
login = "ooc-hack@flint3s.ru"
password = "Sadness9-Judiciary-Fraternal"

# strapi_url = os.environ['STRAPI_URL']
# login = os.environ['STRAPI_LOGIN']
# password = os.environ['STRAPI_PASSWORD']


async def create_notification(data):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    r = await strapi.create_entry("notifications", data)
    print(r)


async def get_entity(collection, field, value):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    try:
        data = await strapi.get_entries(collection, filters={field: {'$eq': value}})
        data = data["data"]
        if data:
            return data[0]
        return None
    except Exception:
        return "Wrong collection or field"


async def get_meeting(id):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    try:
        data = await strapi.get_entries("meetings", filters={"id": {'$eq': id}}, populate='*')
        data = data["data"]
        if data:
            return data[0]
        return None
    except Exception:
        return "Wrong collection or field"


async def get_task(id):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    try:
        data = await strapi.get_entries("tasks", filters={"id": {'$eq': id}}, populate='*')
        data = data["data"]
        if data:
            return data[0]
        return None
    except Exception:
        return "Wrong collection or field"


async def get_users_from_working_group(id):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    try:
        data = await strapi.get_entries("work-groups", filters={"id": {'$eq': id}}, populate='*')
        data = data["data"]
        if data:
            return data[0]
        return None
    except Exception:
        return "Wrong collection or field"