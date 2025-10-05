import React, { useState } from "react";
import axios from "axios";

export default function InputForm({ setImpactData, setDeflectionData }) {
  const [diameter, setDiameter] = useState("");
  const [density, setDensity] = useState("");
  const [velocity, setVelocity] = useState("");
  const [angle, setAngle] = useState("");
  const [distance, setDistance] = useState("");

  const handleImpact = async () => {
    try {
      const res = await axios.post("http://localhost:8000/impact/compute", {
        // diameter_m: parseFloat(diameter),
        // density_kg_m3: parseFloat(density),
        // velocity_km_s: parseFloat(velocity),
        // angle_deg: parseFloat(angle),
        // distance_km: parseFloat(distance),

        diameter_m: Number(diameter),
        density_kg_m3: Number(density),
        velocity_km_s: Number(velocity),
        angle_deg: Number(angle),
        target_type: "rock"
      });
      setImpactData(res.data);
    } catch (err) {
      console.error("Error computing impact:", err);
      alert("Error computing impact. Check console for details.");
    }
  };

  const handleDeflection = async () => {
    try {
      const res = await axios.post("http://localhost:8000/deflection/simulate", {
        diameter_m: parseFloat(diameter),
        density_kg_m3: parseFloat(density),
        velocity_km_s: parseFloat(velocity),
        delta_v: 0.01,  // change in velocity (km/s)
        lead_time: 5,   // years before impact
      });
      setDeflectionData(res.data);
    } catch (err) {
      console.error("Error simulating deflection:", err);
      alert("Error simulating deflection. Check console for details.");
    }
  };

  return (
    <div className="card">
      <h2>Asteroid Parameters</h2>

      <input
        type="number"
        value={diameter}
        onChange={(e) => setDiameter(e.target.value)}
        placeholder="Diameter (m)"
      />
      <input
        type="number"
        value={density}
        onChange={(e) => setDensity(e.target.value)}
        placeholder="Density (kg/m³)"
      />
      <input
        type="number"
        value={velocity}
        onChange={(e) => setVelocity(e.target.value)}
        placeholder="Velocity (km/s)"
      />
      <input
        type="number"
        value={angle}
        onChange={(e) => setAngle(e.target.value)}
        placeholder="Impact Angle (degrees)"
      />
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        placeholder="Distance from Impact (km)"
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button className="impact" onClick={handleImpact}>
          Compute Impact
        </button>
        <button className="deflection" onClick={handleDeflection}>
          Simulate Deflection
        </button>
      </div>
    </div>
  );
}
