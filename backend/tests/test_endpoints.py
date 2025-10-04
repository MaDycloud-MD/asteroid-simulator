from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_impact_compute():
    response = client.post("/impact/compute", json={
        "diameter_m": 100,
        "density_kg_m3": 3000,
        "velocity_km_s": 20
    })
    assert response.status_code == 200
    data = response.json()
    assert "tnt_megatons" in data
