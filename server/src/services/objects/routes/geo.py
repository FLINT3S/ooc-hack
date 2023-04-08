from fastapi import APIRouter

from server.src.services.geocoder.geocoderwrapper import GeocoderRest, GeocoderWrapper

geo_router = APIRouter()

@geo_router.post("/position")
def get_geocode(geocoder: GeocoderRest):
    geocoder_wrapper = GeocoderWrapper()
    return geocoder_wrapper.get_position(geocoder)
