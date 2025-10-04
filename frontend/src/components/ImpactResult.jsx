export default function ImpactResult({ data }) {
  return (
    <div className="card">
      <h2>Impact Results</h2>
      <div className="flex-between"><span>Mass:</span> <span>{data.mass_kg.toLocaleString()} kg</span></div>
      <div className="flex-between"><span>Energy:</span> <span>{data.energy_joules.toExponential(2)} J</span></div>
      <div className="flex-between"><span>TNT Equivalent:</span> <span>{data.tnt_megatons.toFixed(2)} MT</span></div>
      <div className="flex-between"><span>Crater Diameter:</span> <span>{data.crater_km.toFixed(2)} km</span></div>
      <div className="flex-between"><span>5 PSI Blast Radius:</span> <span>{data.blast_radius_5psi_km.toFixed(2)} km</span></div>
      <div className="flex-between"><span>1 PSI Blast Radius:</span> <span>{data.blast_radius_1psi_km.toFixed(2)} km</span></div>
      <div className="flex-between"><span>Impact Type:</span> <span>{data.impact_type}</span></div>
    </div>
  );
}
