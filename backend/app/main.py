from fastapi import FastAPI
from app.routers.routes import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def health_check():
    return {"message": "Rota UEFS Backend is running"}
