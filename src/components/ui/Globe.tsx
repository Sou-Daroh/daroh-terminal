"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Group } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import countries from "@/data/globe.json";
import { arcCoordinates, ARC_COLORS } from "@/data/arcs";

declare module "@react-three/fiber" {
    interface ThreeElements {
        threeGlobe: ThreeElements["mesh"] & {
            new(): ThreeGlobe;
        };
    }
}

extend({ ThreeGlobe: ThreeGlobe });

type Position = {
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
};

export type GlobeConfig = {
    pointSize?: number;
    globeColor?: string;
    showAtmosphere?: boolean;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    emissive?: string;
    emissiveIntensity?: number;
    shininess?: number;
    polygonColor?: string;
    ambientLight?: string;
    directionalLeftLight?: string;
    directionalTopLight?: string;
    pointLight?: string;
    arcTime?: number;
    arcLength?: number;
    rings?: number;
    maxRings?: number;
    initialPosition?: {
        lat: number;
        lng: number;
    };
    autoRotate?: boolean;
    autoRotateSpeed?: number;
};

interface WorldProps {
    globeConfig: GlobeConfig;
    data: Position[];
}

const GlobeComponent = React.memo<WorldProps>(({ globeConfig, data }: WorldProps) => {
    const globeRef = useRef<ThreeGlobe | null>(null);
    const groupRef = useRef<Group>(null!);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize globe only once
    useEffect(() => {
        if (!globeRef.current && groupRef.current) {
            globeRef.current = new ThreeGlobe();
            (groupRef.current as Group).add(globeRef.current);
            setIsInitialized(true);
        }
    }, []);

    // Simple globe setup - no complex loading
    useEffect(() => {
        if (!globeRef.current || !isInitialized || !data) return;

        try {
            // Basic globe setup
            globeRef.current
                .hexPolygonsData(countries.features)
                .hexPolygonResolution(3)
                .hexPolygonMargin(0.7)
                .showAtmosphere(true)
                .atmosphereColor("#0088dd")
                .atmosphereAltitude(0.15)
                .hexPolygonColor(() => "rgba(0, 136, 255, 0.8)");

            // Arcs for all connections
            const simpleArcs = data;
            globeRef.current
                .arcsData(simpleArcs)
                .arcStartLat((d: object) => (d as Position).startLat)
                .arcStartLng((d: object) => (d as Position).startLng)
                .arcEndLat((d: object) => (d as Position).endLat)
                .arcEndLng((d: object) => (d as Position).endLng)
                .arcColor((d: object) => (d as Position).color)
                .arcAltitude((d: object) => (d as Position).arcAlt)
                .arcStroke(0.3)
                .arcDashLength(0.9)
                .arcDashGap(2)
                .arcDashAnimateTime(1000);

            // Simple points
            const points: Array<{lat: number; lng: number; color: string}> = [];
            simpleArcs.forEach((arc: Position) => {
                points.push({ lat: arc.startLat, lng: arc.startLng, color: arc.color });
                points.push({ lat: arc.endLat, lng: arc.endLng, color: arc.color });
            });

            globeRef.current
                .pointsData(points)
                .pointColor((d: object) => (d as {color: string}).color)
                .pointAltitude(0)
                .pointRadius(2);

        } catch (error) {
            console.error('Globe rendering error:', error);
        }
    }, [isInitialized, data, globeConfig]);

    return <group ref={groupRef} />;
});

GlobeComponent.displayName = 'GlobeComponent';

const World = React.memo<WorldProps>((props: WorldProps) => {
    return (
        <Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
            <ambientLight intensity={2.0} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} />
            <directionalLight position={[-10, -10, -5]} intensity={1.5} />
            <pointLight position={[0, 0, 100]} intensity={2.0} color="#00aaff" />
            <pointLight position={[50, 50, 50]} intensity={1.2} color="#4488ff" />
            <GlobeComponent {...props} />
            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={150}
                maxDistance={500}
                autoRotateSpeed={0.5}
                autoRotate={true}
            />
        </Canvas>
    );
});

World.displayName = 'World';



export function Globe({ onExit }: { onExit?: () => void }) {
  const globeConfig = useMemo(
    () => ({
      pointSize: 4,
      globeColor: "#062056",
      showAtmosphere: true,
      atmosphereColor: "#FFFFFF",
      atmosphereAltitude: 0.1,
      emissive: "#062056",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: "rgba(255,255,255,0.7)",
      ambientLight: "#38bdf8",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#ffffff",
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: 22.3193, lng: 114.1694 },
      autoRotate: true,
      autoRotateSpeed: 0.5,
    }),
    []
  );
  
  const sampleArcs = useMemo(
    () => {
      return arcCoordinates.map((arc) => ({
        ...arc,
        color: ARC_COLORS[Math.floor(Math.random() * ARC_COLORS.length)],
      }));
    },
    []
  );

  // Close globe on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && onExit) {
      onExit();
    }
  };

  return (
    <div
      className="flex flex-row items-center justify-center py-4 md:py-20 h-screen bg-black relative w-full"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <button
        onClick={onExit}
        className="absolute top-4 right-4 text-green-400 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold z-50 hover:bg-opacity-75 hover:text-red-400 transition-colors"
        aria-label="Exit Globe"
      >
        &times;
      </button>
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          <h2 className="text-center text-lg md:text-4xl font-bold text-white">
            Global Tech Networks
          </h2>
          <p className="text-center text-sm md:text-lg font-normal text-neutral-200 max-w-md mt-1 md:mt-2 mx-auto">
            A world full of potential.
          </p>
        </motion.div>
        <div className="absolute w-full bottom-0 inset-x-0 h-20 md:h-40 bg-gradient-to-b pointer-events-none select-none from-transparent to-black z-40" />
        <div className="absolute w-full top-16 md:-bottom-20 h-[calc(100vh-8rem)] md:h-full z-10">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}

export default Globe; 