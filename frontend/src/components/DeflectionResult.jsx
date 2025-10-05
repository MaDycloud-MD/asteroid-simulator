import React from "react";

export default function DeflectionResult({ deflectionData }) {
  if (!deflectionData) return <p>No deflection data yet. Run a simulation above.</p>;

  return (
    <div className="card">
      <h2>Deflection Results</h2>
      <p>New Impact Point Distance: {deflectionData.new_impact_distance_km?.toFixed(2) || "N/A"} km</p>
      <p>Time to Impact Adjustment: {deflectionData.time_saved_yrs?.toFixed(2) || "N/A"} years</p>
      <p>Velocity Change Applied: {deflectionData.delta_v_km_s?.toFixed(3) || "N/A"} km/s</p>
      <p>Mitigation Success: {deflectionData.success ? "Yes" : "No"}</p>
    </div>
  );
}
