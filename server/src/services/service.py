from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .objects.routes import dormitories_router
from .objects.routes import auth_router
from .inputs.routes import input_router
from .notifications.routes import notifications_router
from .objects.routes import geo_router
from .xlsx.routes.index import xlsx_router


class APIService:
    def __init__(self):
        self.debug = True
        self.app = FastAPI(
            title="API",
        )

        #  TODO: remove *
        origins = ["*"]
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=[""],
            allow_headers=[""],
        )

        self.attach_routes()

    def attach_routes(self):
        api_router = APIRouter()
        api_router.prefix = "/api"

        api_router.include_router(router=dormitories_router, prefix="/index", tags=["Index"])
        api_router.include_router(router=notifications_router, prefix="/notifications", tags=["Notifications"])
        api_router.include_router(router=auth_router, prefix="/auth", tags=["Auth"])
        api_router.include_router(router=xlsx_router, prefix="/xlsx", tags=["xlsx"])
        api_router.include_router(router=input_router, prefix="/input", tags=["Input"])
        api_router.include_router(router=geo_router, prefix="/geo", tags=["Geo"])

        self.app.include_router(router=api_router)
