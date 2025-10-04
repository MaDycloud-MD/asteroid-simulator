import { useState } from "react";
import InputForm from "./components/InputForm";
import ImpactResult from "./components/ImpactResult";
import DeflectionResult from "./components/DeflectionResult";
import ThreeScene from "./components/ThreeScene";

function App() {
  const [impactData, setImpactData] = useState(null);
  const [deflectionData, setDeflectionData] = useState(null);

  return (
    <div className="container">
      <h1>🌍 Asteroid Impact Simulator</h1>
      <InputForm setImpactData={setImpactData} setDeflectionData={setDeflectionData} />
      {impactData && <ImpactResult data={impactData} />}
      {deflectionData && <DeflectionResult data={deflectionData} />}
      <div style={{ width: "100%", height: "500px" }}>
        <ThreeScene impactData={impactData} />
      </div>
    </div>
  );
}

export default App;
