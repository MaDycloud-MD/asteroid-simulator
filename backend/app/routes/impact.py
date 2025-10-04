from fastapi import APIRouter
from app.schemas.models import ImpactRequest, ImpactResponse
from app.services import physics

router = APIRouter()

@router.post("/compute", response_model=ImpactResponse)
def compute_impact(req: ImpactRequest):
    mass = physics.mass_from_diameter(req.diameter_m, req.density_kg_m3)
    E = physics.kinetic_energy_joules(mass, req.velocity_km_s)
    tnt = physics.tnt_equivalents(E)
    crater = physics.rough_crater_diameter_km(E)
    blast5 = physics.blast_radius_overpressure_km(E, 5)
    blast1 = physics.blast_radius_overpressure_km(E, 1)

    return ImpactResponse(
        mass_kg=mass,
        energy_joules=E,
        tnt_megatons=tnt["megatons"],
        crater_km=crater,
        blast_radius_5psi_km=blast5,
        blast_radius_1psi_km=blast1,
        impact_type=physics.impact_type_simple(req.diameter_m)
    )
