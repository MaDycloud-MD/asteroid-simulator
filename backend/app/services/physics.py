import math

# Constants
R_EARTH = 6371e3  # m
G = 9.81  # m/s^2
RHO_A0 = 1.225  # kg/m^3 sea level
SCALE_HEIGHT = 8000.0  # m
DEFAULT_STRENGTH = 1e6  # Pa (typical rock strength assumption)

def mass_from_diameter(diameter_m: float, density_kg_m3: float = 3000.0) -> float:
    r = diameter_m / 2.0
    return (4.0/3.0) * math.pi * (r**3) * density_kg_m3

def kinetic_energy_joules(mass_kg: float, velocity_km_s: float) -> float:
    v = velocity_km_s * 1000.0
    return 0.5 * mass_kg * v * v

def atmosphere_density_at_altitude(h_m: float) -> float:
    return RHO_A0 * math.exp(-h_m / SCALE_HEIGHT)

def breakup_altitude(diameter_m: float, velocity_km_s: float, strength_pa: float = DEFAULT_STRENGTH):
    """
    Solve for altitude where dynamic pressure q = 0.5 * rho(h) * v^2 equals material strength.
    Returns altitude (m) or None if computation fails.
    """
    v = velocity_km_s * 1000.0
    rho_required = 2.0 * strength_pa / (v * v)
    if rho_required <= 0:
        return None
    if rho_required > RHO_A0:
        # breaks at or below sea level
        return 0.0
    try:
        h = -SCALE_HEIGHT * math.log(rho_required / RHO_A0)
        return max(0.0, h)
    except Exception:
        return None

def collins_transient_crater_diameter_m(diameter_m: float, density_impactor: float,
                                        velocity_km_s: float, angle_deg: float,
                                        target_density: float = 2500.0) -> float:
    """
    Collins-like transient crater scaling (approximate).
    Returns transient crater diameter in meters.
    Note: This implementation is a compact educational approximation.
    """
    L0 = diameter_m  # m
    rho_i = density_impactor
    rho_t = target_density
    v = velocity_km_s  # km/s (Collins exponents expect km/s scale)
    theta = math.radians(angle_deg)
    # heuristic expression with Collins-style exponents/constant
    Dtc_km = 1.161 * (rho_i / rho_t)**(1.0/3.0) * (L0**0.78) * (v**0.44) * (G**(-0.22)) * (math.sin(theta)**(1.0/3.0))
    return Dtc_km * 1000.0

def final_crater_diameter_m(Dtc_m: float) -> float:
    """
    Convert transient crater diameter to final rim-to-rim diameter (meters).
    Uses simple/complex transition heuristic from Collins.
    """
    Dtc_km = Dtc_m / 1000.0
    if Dtc_km <= 2.56:
        Dfr_km = 1.25 * Dtc_km
    else:
        Dc = 3.2  # transition (km), heuristic
        Dfr_km = 1.17 * (Dtc_km ** 1.13) / (Dc ** 0.13)
    return Dfr_km * 1000.0

def tnt_from_energy_megatons(E_joules: float) -> float:
    return E_joules / 4.184e15

def blast_radius_from_energy_mt_m(E_mt: float, overpressure_psi: float = 5.0) -> float:
    """
    Approximate blast radius (meters) for a given overpressure level.
    Uses cube-root scaling tied to energy (megaton).
    """
    if E_mt <= 0:
        return 0.0
    base_km = 3.0
    R_km = base_km * (E_mt ** (1.0/3.0)) * (5.0 / overpressure_psi) ** 0.5
    return R_km * 1000.0

def run_collins_model(diameter_m: float, density_kg_m3: float, velocity_km_s: float,
                      angle_deg: float, target_type: str = "rock", strength_pa: float = DEFAULT_STRENGTH):
    """
    Full pipeline: mass, energy, breakup altitude, airburst decision, crater sizes, blast radii.
    Returns a dict with detailed fields.
    """
    # mass & energy
    mass = mass_from_diameter(diameter_m, density_kg_m3)
    energy = kinetic_energy_joules(mass, velocity_km_s)
    energy_mt = tnt_from_energy_megatons(energy)

    # atmospheric breakup altitude (m)
    z_star = breakup_altitude(diameter_m, velocity_km_s, strength_pa)

    # crudely decide airburst: if breakup altitude > 5 km and small-medium object, treat as airburst
    airburst = False
    if z_star is not None and z_star > 5000.0 and diameter_m < 1000.0:
        airburst = True

    # crater calculations (skip if airburst)
    if airburst:
        transient_m = 0.0
        final_m = 0.0
    else:
        target_density = 2500.0 if target_type == "rock" else 1000.0
        transient_m = collins_transient_crater_diameter_m(diameter_m, density_kg_m3, velocity_km_s, angle_deg, target_density)
        final_m = final_crater_diameter_m(transient_m)

    # blast radii (meters)
    r5_m = blast_radius_from_energy_mt_m(energy_mt, 5.0)
    r1_m = blast_radius_from_energy_mt_m(energy_mt, 1.0)

    return {
        "diameter_m": diameter_m,
        "density_kg_m3": density_kg_m3,
        "velocity_km_s": velocity_km_s,
        "angle_deg": angle_deg,
        "mass_kg": mass,
        "energy_joules": energy,
        "energy_megatons": energy_mt,
        "breakup_altitude_m": z_star,
        "airburst": airburst,
        "transient_crater_m": transient_m,
        "final_crater_m": final_m,
        "blast_radius_5m": r5_m,
        "blast_radius_1m": r1_m,
    }
