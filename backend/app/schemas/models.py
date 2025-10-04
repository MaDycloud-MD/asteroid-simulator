from pydantic import BaseModel

class ImpactRequest(BaseModel):
    diameter_m: float
    density_kg_m3: float
    velocity_km_s: float

class ImpactResponse(BaseModel):
    mass_kg: float
    energy_joules: float
    tnt_megatons: float
    crater_km: float
    blast_radius_5psi_km: float
    blast_radius_1psi_km: float
    impact_type: str

class DeflectionRequest(BaseModel):
    diameter_m: float
    density_kg_m3: float
    velocity_km_s: float
    delta_v: float    # km/s change applied
    lead_time: float  # years

class DeflectionResponse(BaseModel):
    success: bool
    new_trajectory: str
    miss_distance_km: float
