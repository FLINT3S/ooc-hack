from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/notifications/new_notification")
async def root():
    print("notif))")
    return {"message": "Notif!"}


if __name__ == "__main__":
    uvicorn.run("main:app", port=3002, reload=True, workers=1)
