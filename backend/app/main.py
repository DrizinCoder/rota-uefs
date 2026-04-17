from fastapi import FastAPI
from app.routers.routes import router

app = FastAPI()

@app.get("/")
def health_check():
    return {"message": "Rota UEFS Backend is r"}

app.include_router(router)