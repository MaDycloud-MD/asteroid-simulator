import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { fetchNeoData } from "../api/nasaNeo"; 

export default function ThreeScene({ impactData }) {
  const mountRef = useRef(null);
  const [tooltip, setTooltip] = useState("");
  const [timeProgress, setTimeProgress] = useState(0);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // Earth with NASA texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(
      "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg"
    );
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture, shininess: 5 });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Asteroids group
    const asteroidGroup = new THREE.Group();
    scene.add(asteroidGroup);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let asteroidObjects = [];

    const DIST_SCALE = 10000; // scale down km to scene units
    const SIZE_SCALE = 50;

    // Fetch NEOs from NASA
    const today = new Date();
    const start = today.toISOString().split("T")[0];
    const end = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    fetchNeoData(start, end).then((data) => {
      if (!data) return;

      Object.values(data.near_earth_objects).forEach((neos) => {
        neos.forEach((neo) => {
          const distanceKm = parseFloat(neo.close_approach_data[0].miss_distance.kilometers);
          const angle = Math.random() * Math.PI * 2;
          const scaledDistance = distanceKm / DIST_SCALE;
          const x0 = Math.cos(angle) * scaledDistance;
          const y0 = Math.sin(angle) * scaledDistance;

          const geometry = new THREE.SphereGeometry(0.2, 8, 8);
          const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          const asteroid = new THREE.Mesh(geometry, material);
          asteroid.position.set(x0, y0, 0);
          asteroid.userData = {
            name: neo.name,
            size: neo.estimated_diameter.meters.estimated_diameter_max.toFixed(1),
            velocity: neo.close_approach_data[0].relative_velocity.kilometers_per_second,
            startPos: new THREE.Vector3(x0, y0, 0),
          };

          // Line to Earth
          const lineGeom = new THREE.BufferGeometry().setFromPoints([
            asteroid.position.clone(),
            new THREE.Vector3(0, 0, 0),
          ]);
          const line = new THREE.Line(
            lineGeom,
            new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 })
          );

          asteroidGroup.add(asteroid);
          asteroidGroup.add(line);
          asteroidObjects.push(asteroid);
        });
      });
    });

    // Add simulated asteroid from impactData
    if (impactData) {
      const size = impactData.diameter_m ? impactData.diameter_m / SIZE_SCALE : 1;
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const simulatedAsteroid = new THREE.Mesh(geometry, material);

      const distance = impactData.distance_km ? impactData.distance_km / DIST_SCALE : 50;
      const angle = impactData.angle_deg ? (impactData.angle_deg * Math.PI) / 180 : Math.random() * 2 * Math.PI;
      const x0 = Math.cos(angle) * distance;
      const y0 = Math.sin(angle) * distance;
      simulatedAsteroid.position.set(x0, y0, 0);
      simulatedAsteroid.userData = {
        name: "Impactor-2025",
        size: impactData.diameter_m.toFixed(1),
        velocity: impactData.velocity_km_s,
        energy: impactData.energy_megatons?.toFixed(2),
        startPos: new THREE.Vector3(x0, y0, 0),
      };

      asteroidGroup.add(simulatedAsteroid);

      const trajLineGeom = new THREE.BufferGeometry().setFromPoints([
        simulatedAsteroid.position.clone(),
        new THREE.Vector3(0, 0, 0),
      ]);
      const trajLine = new THREE.Line(trajLineGeom, new THREE.LineBasicMaterial({ color: 0xffff00 }));
      asteroidGroup.add(trajLine);
      asteroidObjects.push(simulatedAsteroid);
    }

    // Mouse tooltip
    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001;

      asteroidObjects.forEach((ast) => {
        if (!ast.userData.startPos) return;
        ast.position.lerpVectors(ast.userData.startPos, new THREE.Vector3(0, 0, 0), timeProgress);
      });

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(asteroidGroup.children);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        const data = obj.userData;
        setTooltip(
          `Name: ${data.name || "N/A"} | Size: ${data.size || "N/A"} m | Velocity: ${
            data.velocity || "N/A"
          } km/s | Energy: ${data.energy || "N/A"} MT`
        );
      } else setTooltip("");

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, [impactData, timeProgress]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", bottom: 10, left: 10, width: "300px" }}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={timeProgress}
          onChange={(e) => setTimeProgress(parseFloat(e.target.value))}
        />
        <div style={{ color: "#fff", fontSize: "12px" }}>
          Simulation Progress: {(timeProgress * 100).toFixed(0)}%
        </div>
      </div>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            pointerEvents: "none",
            fontSize: "12px",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}