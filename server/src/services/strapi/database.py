import os

from strapi_client import StrapiClient

from server.src.services.strapi.models import User

strapi_url = os.environ['STRAPI_URL']
login = os.environ['STRAPI_LOGIN']
password = os.environ['STRAPI_PASSWORD']


async def _get_client() -> StrapiClient:
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    return strapi


async def update_entity(collection, object_id, data):
    strapi = await _get_client()
    await strapi.update_entry(collection, object_id, data=data)


async def create_entity(collection, data):
    strapi = await _get_client()
    await strapi.create_entry(collection, data)


async def get_entity(collection, field, value):
    strapi = await _get_client()
    try:
        data = await strapi.get_entries(collection, filters={field: {'$eq': value}})
        data = data["data"]
        if data:
            return data[0]
        return None
    except Exception:
        return "Wrong collection or field"


async def get_user(email=None, id=None):
    strapi = await _get_client()
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
    except Exception:
        print("Wrong collection or field")
        return None


async def get_entity_id(collection, field, value):
    strapi = await _get_client()
    data = await strapi.get_entries(collection, filters={field: {'$eq': value}})
    data = data["data"]
    if data:
        return data[0]["id"]
    return None


async def get_real_estate_with_tasks(real_estate_id) -> dict:
    def unwrap_attributes(object) -> dict | list:
        if isinstance(object, dict):
            if 'id' in object and 'attributes' in object:
                for attribute_key in object['attributes'].keys():
                    object[attribute_key] = object['attributes'][attribute_key]
                    if attribute_key != 'attachments' and isinstance(object[attribute_key], dict) and 'data' in object[attribute_key]:
                        if isinstance(object[attribute_key]['data'], list):
                            objects = []
                            for element in object[attribute_key]['data']:
                                objects.append(element)
                            object[attribute_key] = objects
                        elif isinstance(object[attribute_key]['data'], dict):
                            object[attribute_key] = object[attribute_key]['data']
                    unwrap_attributes(object[attribute_key])
                object.pop('attributes')
        elif isinstance(object, list):
            for element in object:
                unwrap_attributes(element)
        return object

    strapi = await _get_client()
    find_params = {
        "filters": {"id": {'$eq': real_estate_id}},
        "populate": {
            "tasks": {
                "populate": [
                    "assignee"
                ]
            },
            "buildingType": {
                "populate": ["*"]
            }
        }
    }
    data = await strapi.get_entries("real-estates", **find_params)
    return unwrap_attributes(data['data'][0])
