import asyncio
import os
from strapi_client import StrapiClient

# strapi_url = "https://2198-178-71-66-26.eu.ngrok.io/"
# login = "ooc-hack@flint3s.ru"
# password = "Sadness9-Judiciary-Fraternal"

strapi_url = os.environ['STRAPI_URL']
login = os.environ['STRAPI_LOGIN']
password = os.environ['STRAPI_PASSWORD']

async def update_entity(collection, field, data):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password) # optional
    users = await strapi.get_entries(collection, filters={field: {'$eq': data}})
    try:
        user_id = users["data"][0]['id']
        await strapi.update_entry(collection, user_id, data={field: 'admin'})
    except IndexError as e:
        print("No data with your properties")


async def create_entity(collection, data):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password) # optional
    await strapi.create_entry(collection, {"test": data})


async def get_entity(collection, field, data):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password) # optional
    data = await strapi.get_entries(collection, filters={field: {'$eq': data}})
    data = data["data"]
    if data:
        return data[0]
    return None


if __name__ == "__main__":
    # asyncio.run(update_entity("tests", "test", "vasysa"))
    # asyncio.run(create_entity("tests", "vasya_new"))
    test_object = asyncio.run(get_entity("tests", "test", "admin"))
    print(test_object)
