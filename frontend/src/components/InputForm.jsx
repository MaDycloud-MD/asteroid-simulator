import { useState } from "react";
import axios from "axios";

export default function InputForm({ setImpactData, setDeflectionData }) {
  const [diameter, setDiameter] = useState(50);
  const [density, setDensity] = useState(3000);
  const [velocity, setVelocity] = useState(20);

  const handleImpact = async () => {
    const res = await axios.post("http://localhost:8000/impact/compute", {
      diameter_m: parseFloat(diameter),
      density_kg_m3: parseFloat(density),
      velocity_km_s: parseFloat(velocity),
    });
    setImpactData(res.data);
  };

  const handleDeflection = async () => {
    const res = await axios.post("http://localhost:8000/deflection/simulate", {
      diameter_m: parseFloat(diameter),
      density_kg_m3: parseFloat(density),
      velocity_km_s: parseFloat(velocity),
      delta_v: 0.01,
      lead_time: 5,
    });
    setDeflectionData(res.data);
  };

  return (
    <div className="card">
      <h2>Asteroid Parameters</h2>
      <input type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} placeholder="Diameter (m)" />
      <input type="number" value={density} onChange={(e) => setDensity(e.target.value)} placeholder="Density (kg/m³)" />
      <input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="Velocity (km/s)" />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button className="impact" onClick={handleImpact}>Compute Impact</button>
        <button className="deflection" onClick={handleDeflection}>Simulate Deflection</button>
      </div>
    </div>
  );
}
