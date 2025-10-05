# app/routes/impact.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services import physics

router = APIRouter()

class ImpactRequest(BaseModel):
    diameter_m: float = Field(..., gt=0)
    density_kg_m3: float = Field(3000.0, gt=0)
    velocity_km_s: float = Field(..., gt=0)
    angle_deg: float = Field(45.0, gt=0, le=90.0)
    target_type: str = Field("rock")

class ImpactResponse(BaseModel):
    diameter_m: float
    density_kg_m3: float
    velocity_km_s: float
    angle_deg: float
    mass_kg: float
    energy_joules: float
    energy_megatons: float
    breakup_altitude_m: float 
    airburst: bool
    transient_crater_m: float
    final_crater_m: float
    blast_radius_5m: float
    blast_radius_1m: float

@router.post("/compute", response_model=ImpactResponse)
def compute_impact(req: ImpactRequest):
    try:
        out = physics.run_collins_model(
            diameter_m=req.diameter_m,
            density_kg_m3=req.density_kg_m3,
            velocity_km_s=req.velocity_km_s,
            angle_deg=req.angle_deg,
            target_type=req.target_type
        )
        return out
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
