export default function DeflectionResult({ data }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-3">
      <h2 className="text-xl font-semibold text-green-400">Deflection Simulation</h2>
      <div className="flex justify-between"><span>Success:</span> <span>{data.success ? "✅ Yes" : "❌ No"}</span></div>
      <div className="flex justify-between"><span>New Trajectory:</span> <span>{data.new_trajectory}</span></div>
      <div className="flex justify-between"><span>Miss Distance:</span> <span>{data.miss_distance_km.toFixed(2)} km</span></div>
    </div>
  );
}
