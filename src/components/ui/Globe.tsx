"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Group } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import countries from "@/data/globe.json";

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

export function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
    const arr = [];
    while (arr.length < count) {
        const r = Math.floor(Math.random() * (max - min)) + min;
        if (arr.indexOf(r) === -1) arr.push(r);
    }

    return arr;
}

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
      const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
      return [
        {
          order: 1,
          startLat: -19.885592,
          startLng: -43.951191,
          endLat: -22.9068,
          endLng: -43.1729,
          arcAlt: 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 1,
          startLat: 28.6139,
          startLng: 77.209,
          endLat: 3.139,
          endLng: 101.6869,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 1,
          startLat: -19.885592,
          startLng: -43.951191,
          endLat: -1.303396,
          endLng: 36.852443,
          arcAlt: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 2,
          startLat: 1.3521,
          startLng: 103.8198,
          endLat: 35.6762,
          endLng: 139.6503,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 2,
          startLat: 51.5072,
          startLng: -0.1276,
          endLat: 3.139,
          endLng: 101.6869,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 2,
          startLat: -15.785493,
          startLng: -47.909029,
          endLat: 36.162809,
          endLng: -115.119411,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 3,
          startLat: -33.8688,
          startLng: 151.2093,
          endLat: 22.3193,
          endLng: 114.1694,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 3,
          startLat: 21.3099,
          startLng: -157.8581,
          endLat: 40.7128,
          endLng: -74.006,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 3,
          startLat: -6.2088,
          startLng: 106.8456,
          endLat: 51.5072,
          endLng: -0.1276,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 4,
          startLat: 11.986597,
          startLng: 8.571831,
          endLat: -15.595412,
          endLng: -56.05918,
          arcAlt: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 4,
          startLat: -34.6037,
          startLng: -58.3816,
          endLat: 22.3193,
          endLng: 114.1694,
          arcAlt: 0.7,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 4,
          startLat: 51.5072,
          startLng: -0.1276,
          endLat: 48.8566,
          endLng: -2.3522,
          arcAlt: 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 5,
          startLat: 14.5995,
          startLng: 120.9842,
          endLat: 51.5072,
          endLng: -0.1276,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 5,
          startLat: 1.3521,
          startLng: 103.8198,
          endLat: -33.8688,
          endLng: 151.2093,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 5,
          startLat: 34.0522,
          startLng: -118.2437,
          endLat: 48.8566,
          endLng: -2.3522,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 6,
          startLat: -15.432563,
          startLng: 28.315853,
          endLat: 1.094136,
          endLng: -63.34546,
          arcAlt: 0.7,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 6,
          startLat: 37.5665,
          startLng: 126.978,
          endLat: 35.6762,
          endLng: 139.6503,
          arcAlt: 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 6,
          startLat: 22.3193,
          startLng: 114.1694,
          endLat: 51.5072,
          endLng: -0.1276,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 7,
          startLat: -19.885592,
          startLng: -43.951191,
          endLat: -15.595412,
          endLng: -56.05918,
          arcAlt: 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 7,
          startLat: 48.8566,
          startLng: -2.3522,
          endLat: 52.52,
          endLng: 13.405,
          arcAlt: 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 7,
          startLat: 52.52,
          startLng: 13.405,
          endLat: 34.0522,
          endLng: -118.2437,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 8,
          startLat: -8.833221,
          startLng: 13.264837,
          endLat: -33.936138,
          endLng: 18.436529,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 8,
          startLat: 49.2827,
          startLng: -123.1207,
          endLat: 52.3676,
          endLng: 4.9041,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 8,
          startLat: 1.3521,
          startLng: 103.8198,
          endLat: 40.7128,
          endLng: -74.006,
          arcAlt: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 9,
          startLat: 51.5072,
          startLng: -0.1276,
          endLat: 34.0522,
          endLng: -118.2437,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 9,
          startLat: 22.3193,
          startLng: 114.1694,
          endLat: -22.9068,
          endLng: -43.1729,
          arcAlt: 0.7,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 9,
          startLat: 1.3521,
          startLng: 103.8198,
          endLat: -34.6037,
          endLng: -58.3816,
          arcAlt: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 10,
          startLat: -22.9068,
          startLng: -43.1729,
          endLat: 28.6139,
          endLng: 77.209,
          arcAlt: 0.7,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 10,
          startLat: 34.0522,
          startLng: -118.2437,
          endLat: 31.2304,
          endLng: 121.4737,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 10,
          startLat: -6.2088,
          startLng: 106.8456,
          endLat: 52.3676,
          endLng: 4.9041,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 11,
          startLat: 41.9028,
          startLng: 12.4964,
          endLat: 34.0522,
          endLng: -118.2437,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 11,
          startLat: -6.2088,
          startLng: 106.8456,
          endLat: 31.2304,
          endLng: 121.4737,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 11,
          startLat: 22.3193,
          startLng: 114.1694,
          endLat: 1.3521,
          endLng: 103.8198,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 12,
          startLat: 34.0522,
          startLng: -118.2437,
          endLat: 37.7749,
          endLng: -122.4194,
          arcAlt: 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 12,
          startLat: 35.6762,
          startLng: 139.6503,
          endLat: 22.3193,
          endLng: 114.1694,
          arcAlt: 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 12,
          startLat: 22.3193,
          startLng: 114.1694,
          endLat: 34.0522,
          endLng: -118.2437,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 13,
          startLat: 52.52,
          startLng: 13.405,
          endLat: 22.3193,
          endLng: 114.1694,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 13,
          startLat: 11.986597,
          startLng: 8.571831,
          endLat: 35.6762,
          endLng: 139.6503,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 13,
          startLat: -22.9068,
          startLng: -43.1729,
          endLat: -34.6037,
          endLng: -58.3816,
          arcAlt: 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
        {
          order: 14,
          startLat: -33.936138,
          startLng: 18.436529,
          endLat: 21.395643,
          endLng: 39.883798,
          arcAlt: 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ];
    },
    []
  );

  return (
    <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto dark:bg-black bg-white relative w-full">
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
          <h2 className="text-center text-xl md:text-4xl font-bold text-black dark:text-white">
            Global Tech Networks
          </h2>
          <p className="text-center text-base md:text-lg font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto">
            A world full of potential.
          </p>
        </motion.div>
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
        <div className="absolute w-full -bottom-20 h-72 md:h-full z-10">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}

export default Globe; 