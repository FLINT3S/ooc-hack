from starlette.middleware.cors import CORSMiddleware

import uvicorn

from server.src.services.service import APIService

api = APIService()

api.app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@api.app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}


if __name__ == "__main__":
    uvicorn.run("main:api.app", port=3000, reload=True, workers=1)
