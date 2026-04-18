from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"message": "Fleet router is running"}

@router.get("/")
async def get_all():
    return {"message": "Get all fleets endpoint"}

@router.get("/{plate}")
async def get_by_id(plate: str):
    return {"message": f"Get fleet with id {plate} endpoint"}

@router.post("/")
async def create_bus():
    return {"message": "Create bus endpoint"}

@router.patch("/")
async def update_bus():
    return {"message": "Update bus endpoint"}

@router.post("/batch")
async def create_buses_batch():
    return {"message": "Create buses batch endpoint"}

@router.patch("/batch")
async def update_buses_batch():
    return {"message": "Update buses batch endpoint"}

@router.delete("/")
async def delete_bus():
    return {"message": "Delete bus endpoint"}

@router.delete("/batch")
async def delete_buses_batch():
    return {"message": "Delete buses batch endpoint"}
