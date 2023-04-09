from enum import Enum

import requests

from fastapi import HTTPException
from pydantic import BaseModel


class GeocoderRestType(Enum):
    ADDRESS = "address"
    COORDS = "coords"


class GeocoderRest(BaseModel):
    class Config:
        use_enum_values = True

    type: GeocoderRestType
    value: dict


class GeocoderWrapper:
    api_key = "e433531b-8a82-45bb-b70e-ca210299ba0b"
    first_URL = "https://geocode-maps.yandex.ru/1.x/?apikey=" + api_key

    def get_position(self, geocoder_rest: GeocoderRest):
        if GeocoderRestType.ADDRESS.value == geocoder_rest.type:
            second_url = "&geocode=" + "+".join(geocoder_rest.value["address"].split(" "))
            url = self.first_URL + second_url + "&format=json"
            request = requests.get(url=url)
            return self.get_normalized_json(request.json())
        elif GeocoderRestType.COORDS.value == geocoder_rest.type:
            longitude = geocoder_rest.value["longitude"]
            latitude = geocoder_rest.value["latitude"]
            second_url = "&geocode=" + longitude + "," + latitude
            url = self.first_URL + second_url + "&format=json"
            request = requests.get(url=url)
            return self.get_normalized_json(request.json())
        else:
            return HTTPException(status_code=401, detail='Invalid type')

    def get_normalized_json(self, json):
        return {
            "address":
                json.get("response", {}).get("GeoObjectCollection", {}).get("featureMember", {})[0]
                .get("GeoObject", {}).get("metaDataProperty", {}).get("GeocoderMetaData", {}).get("Address", {})
                .get("formatted", {}),
            "coords":
                json.get("response", {}).get("GeoObjectCollection", {}).get("featureMember", {})[0].get("GeoObject", {})
                .get("Point", {})
        }