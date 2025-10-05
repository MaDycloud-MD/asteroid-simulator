import React from "react";

export default function ImpactResult({ impactData }) {
  if (!impactData) return <p>No impact data yet. Submit parameters above.</p>;

  return (
    <div className="card">
      <h2>Impact Results</h2>
      <p>Mass: {impactData.mass_kg?.toFixed(2) || "N/A"} kg</p>
      <p>Energy: {impactData.energy_megatons?.toFixed(2) || "N/A"} MT</p>
      <p>Breakup Altitude: {impactData.breakup_altitude_m?.toFixed(0) || "N/A"} m</p>
      <p>Airburst: {impactData.airburst ? "Yes" : "No"}</p>
      <p>Transient Crater Diameter: {impactData.transient_crater_m?.toFixed(2) || "N/A"} m</p>
      <p>Final Crater Diameter: {impactData.final_crater_m?.toFixed(2) || "N/A"} m</p>
      <p>5 PSI Blast Radius: {impactData.blast_radius_5m?.toFixed(2) || "N/A"} m</p>
      <p>1 PSI Blast Radius: {impactData.blast_radius_1m?.toFixed(2) || "N/A"} m</p>
    </div>
  );
}
