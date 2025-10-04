import math

def mass_from_diameter(diameter_m, density_kg_m3=3000.0):
    r = diameter_m / 2.0
    volume = (4.0/3.0) * math.pi * (r**3)
    return volume * density_kg_m3

def kinetic_energy_joules(mass_kg, velocity_km_s):
    v_m_s = velocity_km_s * 1000.0
    return 0.5 * mass_kg * (v_m_s ** 2)

def tnt_equivalents(E_joules):
    return {
        "tons": E_joules / 4.184e9,
        "kilotons": E_joules / 4.184e12,
        "megatons": E_joules / 4.184e15,
    }

def impact_type_simple(diameter_m):
    return "Airburst likely" if diameter_m < 25.0 else "Surface impact likely"

def rough_crater_diameter_km(E_joules):
    mt = tnt_equivalents(E_joules)["megatons"]
    if mt <= 0:
        return 0.0
    return 1.6 * (mt ** (1.0/3.0))

def blast_radius_overpressure_km(E_joules, overpressure_psi=5.0):
    mt = tnt_equivalents(E_joules)["megatons"]
    if mt <= 0:
        return 0.0
    base_factor = 3.0
    factor = (5.0 / overpressure_psi) ** 0.5
    return base_factor * (mt ** (1.0/3.0)) * factor
