from fastapi import APIRouter
from app.schemas.models import DeflectionRequest, DeflectionResponse

router = APIRouter()

@router.post("/simulate", response_model=DeflectionResponse)
def simulate_deflection(req: DeflectionRequest):
    
    displacement_km = req.delta_v * 1000 * req.lead_time * 3.15e7 / 1000.0
    success = displacement_km > 1000
    return DeflectionResponse(
        success=success,
        new_trajectory="Shifted away from Earth" if success else "Still intersects Earth",
        miss_distance_km=displacement_km if success else 0.0
    )
