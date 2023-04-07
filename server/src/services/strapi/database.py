import asyncio
from strapi_client import StrapiClient

strapi_url = "https://2198-178-71-66-26.eu.ngrok.io/"
login = "ooc-hack@flint3s.ru"
password = "Sadness9-Judiciary-Fraternal"

async def update_entity(collection, field, data):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password) # optional
    users = await strapi.get_entries(collection, filters={field: {'$eq': data}})
    print(users)
    user_id = users["data"][0]['id']
    print(user_id)
    r = await strapi.update_entry(collection, user_id, data={field: 'admin'})
    print(r)
    users = await strapi.get_entries(collection, filters={field: {'$eq': data}})
    print(users)


asyncio.run(update_entity("tests", "test", "vasysa"))
