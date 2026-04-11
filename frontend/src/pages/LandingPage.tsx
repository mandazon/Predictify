"use client"; // Ajouté pour compatibilité Next.js (supprimez si vous utilisez Create React App)
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import countries from '../data/globe.json'; // Assurez-vous que ce fichier existe dans public/data/
import '../styles/LandingPage.css';

// Interface pour GeoJSON FeatureCollection
interface GeoJSONFeature {
  type: string;
  properties: { name: string };
  geometry: { type: string; coordinates: number[][][] };
}

interface GeoJSON {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// Extension de ThreeGlobe pour React Three Fiber
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe;
    };
  }
}
extend({ ThreeGlobe: ThreeGlobe });

// Interfaces TypeScript
interface Position {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}

interface Point {
  lat: number;
  lng: number;
  size: number;
  color: string;
  order: number;
}

interface GlobeConfig {
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
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

// Données par défaut (10 connexions bidirectionnelles centrées sur Antananarivo + 90 arcs supplémentaires)
const predictifyData: Position[] = [
  // Antananarivo ↔ New York
  { order: 1, startLat: -18.8792, startLng: 47.5079, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.3, color: '#00FF00' },
  { order: 2, startLat: 40.7128, startLng: -74.0060, endLat: -18.8792, endLng: 47.5079, arcAlt: 0.3, color: '#00FF00' },
  // Antananarivo ↔ Tokyo
  { order: 3, startLat: -18.8792, startLng: 47.5079, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: '#FF0000' },
  { order: 4, startLat: 35.6762, startLng: 139.6503, endLat: -18.8792, endLng: 47.5079, arcAlt: 0.3, color: '#FF0000' },
  // Antananarivo ↔ Londres
  { order: 5, startLat: -18.8792, startLng: 47.5079, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 6, startLat: 51.5074, startLng: -0.1278, endLat: -18.8792, endLng: 47.5079, arcAlt: 0.3, color: '#FFFFFF' },
  // Antananarivo ↔ Sydney
  { order: 7, startLat: -18.8792, startLng: 47.5079, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.3, color: '#00FF00' },
  { order: 8, startLat: -33.8688, startLng: 151.2093, endLat: -18.8792, endLng: 47.5079, arcAlt: 0.3, color: '#00FF00' },
  // Antananarivo ↔ Johannesburg
  { order: 9, startLat: -18.8792, startLng: 47.5079, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.3, color: '#FF0000' },
  { order: 10, startLat: -26.2041, startLng: 28.0473, endLat: -18.8792, endLng: 47.5079, arcAlt: 0.3, color: '#FF0000' },
  // 90 arcs supplémentaires pour des échanges mondiaux
  { order: 11, startLat: 48.8566, startLng: 2.3522, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.3, color: '#00FF00' }, // Paris ↔ New York
  { order: 12, startLat: 40.7128, startLng: -74.0060, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: '#00FF00' },
  { order: 13, startLat: 25.2048, startLng: 55.2708, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: '#FF0000' }, // Dubai ↔ Tokyo
  { order: 14, startLat: 35.6762, startLng: 139.6503, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: '#FF0000' },
  { order: 15, startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.3, color: '#FFFFFF' }, // Singapore ↔ Sydney
  { order: 16, startLat: -33.8688, startLng: 151.2093, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 17, startLat: -23.5505, startLng: -46.6333, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: '#00FF00' }, // São Paulo ↔ Londres
  { order: 18, startLat: 51.5074, startLng: -0.1278, endLat: -23.5505, endLng: -46.6333, arcAlt: 0.3, color: '#00FF00' },
  { order: 19, startLat: 39.9042, startLng: 116.4074, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: '#FF0000' }, // Beijing ↔ Los Angeles
  { order: 20, startLat: 34.0522, startLng: -118.2437, endLat: 39.9042, endLng: 116.4074, arcAlt: 0.3, color: '#FF0000' },
  { order: 21, startLat: 55.7558, startLng: 37.6173, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.3, color: '#FFFFFF' }, // Moscou ↔ New York
  { order: 22, startLat: 40.7128, startLng: -74.0060, endLat: 55.7558, endLng: 37.6173, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 23, startLat: 28.6139, startLng: 77.2090, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: '#00FF00' }, // Delhi ↔ Dubai
  { order: 24, startLat: 25.2048, startLng: 55.2708, endLat: 28.6139, endLng: 77.2090, arcAlt: 0.3, color: '#00FF00' },
  { order: 25, startLat: -34.6037, startLng: -58.3816, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.3, color: '#FF0000' }, // Buenos Aires ↔ Johannesburg
  { order: 26, startLat: -26.2041, startLng: 28.0473, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.3, color: '#FF0000' },
  { order: 27, startLat: 35.6762, startLng: 139.6503, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.3, color: '#FFFFFF' }, // Tokyo ↔ Singapore
  { order: 28, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 29, startLat: 48.8566, startLng: 2.3522, endLat: 55.7558, endLng: 37.6173, arcAlt: 0.3, color: '#00FF00' }, // Paris ↔ Moscou
  { order: 30, startLat: 55.7558, startLng: 37.6173, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: '#00FF00' },
  { order: 31, startLat: 41.8781, startLng: -87.6298, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: '#FF0000' }, // Chicago ↔ Londres
  { order: 32, startLat: 51.5074, startLng: -0.1278, endLat: 41.8781, endLng: -87.6298, arcAlt: 0.3, color: '#FF0000' },
  { order: 33, startLat: 19.4326, startLng: -99.1332, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: '#FFFFFF' }, // Mexico ↔ Los Angeles
  { order: 34, startLat: 34.0522, startLng: -118.2437, endLat: 19.4326, endLng: -99.1332, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 35, startLat: 22.3193, startLng: 114.1694, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.3, color: '#00FF00' }, // Hong Kong ↔ Singapore
  { order: 36, startLat: 1.3521, startLng: 103.8198, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: '#00FF00' },
  { order: 37, startLat: -33.8688, startLng: 151.2093, endLat: -36.8485, endLng: 174.7633, arcAlt: 0.3, color: '#FF0000' }, // Sydney ↔ Auckland
  { order: 38, startLat: -36.8485, startLng: 174.7633, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.3, color: '#FF0000' },
  { order: 39, startLat: 37.7749, startLng: -122.4194, endLat: 39.9042, endLng: 116.4074, arcAlt: 0.3, color: '#FFFFFF' }, // San Francisco ↔ Beijing
  { order: 40, startLat: 39.9042, startLng: 116.4074, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 41, startLat: 30.0444, startLng: 31.2357, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: '#00FF00' }, // Le Caire ↔ Dubai
  { order: 42, startLat: 25.2048, startLng: 55.2708, endLat: 30.0444, endLng: 31.2357, arcAlt: 0.3, color: '#00FF00' },
  { order: 43, startLat: 52.5200, startLng: 13.4050, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: '#FF0000' }, // Berlin ↔ Paris
  { order: 44, startLat: 48.8566, startLng: 2.3522, endLat: 52.5200, endLng: 13.4050, arcAlt: 0.3, color: '#FF0000' },
  { order: 45, startLat: -1.2864, startLng: 36.8172, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.3, color: '#FFFFFF' }, // Nairobi ↔ Johannesburg
  { order: 46, startLat: -26.2041, startLng: 28.0473, endLat: -1.2864, endLng: 36.8172, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 47, startLat: 35.6762, startLng: 139.6503, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.3, color: '#00FF00' }, // Tokyo ↔ San Francisco
  { order: 48, startLat: 37.7749, startLng: -122.4194, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: '#00FF00' },
  { order: 49, startLat: 22.3193, startLng: 114.1694, endLat: 28.6139, endLng: 77.2090, arcAlt: 0.3, color: '#FF0000' }, // Hong Kong ↔ Delhi
  { order: 50, startLat: 28.6139, startLng: 77.2090, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: '#FF0000' },
  { order: 51, startLat: 55.7558, startLng: 37.6173, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: '#FFFFFF' }, // Moscou ↔ Dubai
  { order: 52, startLat: 25.2048, startLng: 55.2708, endLat: 55.7558, endLng: 37.6173, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 53, startLat: -34.6037, startLng: -58.3816, endLat: -23.5505, endLng: -46.6333, arcAlt: 0.3, color: '#00FF00' }, // Buenos Aires ↔ São Paulo
  { order: 54, startLat: -23.5505, startLng: -46.6333, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.3, color: '#00FF00' },
  { order: 55, startLat: 40.4168, startLng: -3.7038, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: '#FF0000' }, // Madrid ↔ Paris
  { order: 56, startLat: 48.8566, startLng: 2.3522, endLat: 40.4168, endLng: -3.7038, arcAlt: 0.3, color: '#FF0000' },
  { order: 57, startLat: 35.6762, startLng: 139.6503, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: '#FFFFFF' }, // Tokyo ↔ Hong Kong
  { order: 58, startLat: 22.3193, startLng: 114.1694, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 59, startLat: 51.5074, startLng: -0.1278, endLat: 52.5200, endLng: 13.4050, arcAlt: 0.3, color: '#00FF00' }, // Londres ↔ Berlin
  { order: 60, startLat: 52.5200, startLng: 13.4050, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: '#00FF00' },
  { order: 61, startLat: -33.8688, startLng: 151.2093, endLat: 39.9042, endLng: 116.4074, arcAlt: 0.3, color: '#FF0000' }, // Sydney ↔ Beijing
  { order: 62, startLat: 39.9042, startLng: 116.4074, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.3, color: '#FF0000' },
  { order: 63, startLat: 25.2048, startLng: 55.2708, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.3, color: '#FFFFFF' }, // Dubai ↔ Singapore
  { order: 64, startLat: 1.3521, startLng: 103.8198, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 65, startLat: 40.7128, startLng: -74.0060, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: '#00FF00' }, // New York ↔ Los Angeles
  { order: 66, startLat: 34.0522, startLng: -118.2437, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.3, color: '#00FF00' },
  { order: 67, startLat: -23.5505, startLng: -46.6333, endLat: 19.4326, endLng: -99.1332, arcAlt: 0.3, color: '#FF0000' }, // São Paulo ↔ Mexico
  { order: 68, startLat: 19.4326, startLng: -99.1332, endLat: -23.5505, endLng: -46.6333, arcAlt: 0.3, color: '#FF0000' },
  { order: 69, startLat: 55.7558, startLng: 37.6173, endLat: 28.6139, endLng: 77.2090, arcAlt: 0.3, color: '#FFFFFF' }, // Moscou ↔ Delhi
  { order: 70, startLat: 28.6139, startLng: 77.2090, endLat: 55.7558, endLng: 37.6173, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 71, startLat: 48.8566, startLng: 2.3522, endLat: 41.8781, endLng: -87.6298, arcAlt: 0.3, color: '#00FF00' }, // Paris ↔ Chicago
  { order: 72, startLat: 41.8781, startLng: -87.6298, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: '#00FF00' },
  { order: 73, startLat: 35.6762, startLng: 139.6503, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.3, color: '#FF0000' }, // Tokyo ↔ Sydney
  { order: 74, startLat: -33.8688, startLng: 151.2093, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: '#FF0000' },
  { order: 75, startLat: 25.2048, startLng: 55.2708, endLat: 30.0444, endLng: 31.2357, arcAlt: 0.3, color: '#FFFFFF' }, // Dubai ↔ Le Caire
  { order: 76, startLat: 30.0444, startLng: 31.2357, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 77, startLat: 51.5074, startLng: -0.1278, endLat: 40.4168, endLng: -3.7038, arcAlt: 0.3, color: '#00FF00' }, // Londres ↔ Madrid
  { order: 78, startLat: 40.4168, startLng: -3.7038, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: '#00FF00' },
  { order: 79, startLat: -26.2041, startLng: 28.0473, endLat: -1.2864, endLng: 36.8172, arcAlt: 0.3, color: '#FF0000' }, // Johannesburg ↔ Nairobi
  { order: 80, startLat: -1.2864, startLng: 36.8172, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.3, color: '#FF0000' },
  { order: 81, startLat: 39.9042, startLng: 116.4074, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: '#FFFFFF' }, // Beijing ↔ Hong Kong
  { order: 82, startLat: 22.3193, startLng: 114.1694, endLat: 39.9042, endLng: 116.4074, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 83, startLat: 34.0522, startLng: -118.2437, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.3, color: '#00FF00' }, // Los Angeles ↔ San Francisco
  { order: 84, startLat: 37.7749, startLng: -122.4194, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: '#00FF00' },
  { order: 85, startLat: 48.8566, startLng: 2.3522, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: '#FF0000' }, // Paris ↔ Dubai
  { order: 86, startLat: 25.2048, startLng: 55.2708, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: '#FF0000' },
  { order: 87, startLat: 35.6762, startLng: 139.6503, endLat: 39.9042, endLng: 116.4074, arcAlt: 0.3, color: '#FFFFFF' }, // Tokyo ↔ Beijing
  { order: 88, startLat: 39.9042, startLng: 116.4074, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 89, startLat: 51.5074, startLng: -0.1278, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: '#00FF00' }, // Londres ↔ Los Angeles
  { order: 90, startLat: 34.0522, startLng: -118.2437, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: '#00FF00' },
  { order: 91, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: '#FF0000' }, // Sydney ↔ Hong Kong
  { order: 92, startLat: 22.3193, startLng: 114.1694, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.3, color: '#FF0000' },
  { order: 93, startLat: 25.2048, startLng: 55.2708, endLat: 28.6139, endLng: 77.2090, arcAlt: 0.3, color: '#FFFFFF' }, // Dubai ↔ Delhi
  { order: 94, startLat: 28.6139, startLng: 77.2090, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: '#FFFFFF' },
  { order: 95, startLat: 40.7128, startLng: -74.0060, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: '#00FF00' }, // New York ↔ Paris
  { order: 96, startLat: 48.8566, startLng: 2.3522, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.3, color: '#00FF00' },
  { order: 97, startLat: 35.6762, startLng: 139.6503, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: '#FF0000' }, // Tokyo ↔ Londres
  { order: 98, startLat: 51.5074, startLng: -0.1278, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: '#FF0000' },
  { order: 99, startLat: -26.2041, startLng: 28.0473, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.3, color: '#FFFFFF' }, // Johannesburg ↔ Buenos Aires
  { order: 100, startLat: -34.6037, startLng: -58.3816, endLat: -26.2041, endLng: 28.0473, arcAlt: 0.3, color: '#FFFFFF' },
];

// Fonction utilitaire pour convertir les couleurs hexadécimales en RGB
function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Composant WebGLRendererConfig
function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x111827, 0); // Fond sombre pour faire ressortir les arcs
  }, [gl, size]);
  return null;
}

// Composant Globe
function Globe({ config, data }: { config: GlobeConfig; data: Position[] }) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filteredPoints, setFilteredPoints] = useState<Point[]>([]);

  const defaultProps = {
    pointSize: 1,
    globeColor: '#1E3A8A',
    showAtmosphere: true,
    atmosphereColor: '#3B82F6',
    atmosphereAltitude: 0.1,
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: 'rgba(255,255,255,0.7)',
    ambientLight: '#ffffff',
    directionalLeftLight: '#ffffff',
    directionalTopLight: '#ffffff',
    pointLight: '#ffffff',
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 4,
    autoRotate: true,
    autoRotateSpeed: 1,
    ...config,
  };

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as THREE.MeshPhongMaterial;
    globeMaterial.color = new THREE.Color(defaultProps.globeColor);
    globeMaterial.emissive = new THREE.Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;

    const points: Point[] = [];
    data.forEach((arc) => {
      const rgb = hexToRgb(arc.color);
      if (rgb) {
        points.push({ lat: arc.startLat, lng: arc.startLng, size: defaultProps.pointSize, color: arc.color, order: arc.order });
        points.push({ lat: arc.endLat, lng: arc.endLng, size: defaultProps.pointSize, color: arc.color, order: arc.order });
      }
    });

    const newFilteredPoints = points.filter((v, i, a) =>
      a.findIndex((v2) => ['lat', 'lng'].every((k) => v2[k as keyof Point] === v[k as keyof Point])) === i
    );
    setFilteredPoints(newFilteredPoints);

    globeRef.current
      .hexPolygonsData((countries as GeoJSON).features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor)
      .arcsData(data)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor('color')
      .arcAltitude('arcAlt')
      .arcStroke(() => [0.28, 0.3, 0.32][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap('order')
      .arcDashGap(15)
      .arcDashAnimateTime(defaultProps.arcTime)
      .pointsData(newFilteredPoints)
      .pointColor('color')
      .pointAltitude(0)
      .pointRadius(2)
      .ringsData([])
      .ringColor('color')
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);
  }, [
    isInitialized,
    data,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.atmosphereAltitude,
    defaultProps.atmosphereColor,
    defaultProps.emissive,
    defaultProps.emissiveIntensity,
    defaultProps.globeColor,
    defaultProps.maxRings,
    defaultProps.pointSize,
    defaultProps.polygonColor,
    defaultProps.rings,
    defaultProps.shininess,
    defaultProps.showAtmosphere,
  ]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data.length) return;

    // Anneaux pulsants uniquement sur les six villes principales
    const ringCities = [
      { lat: -18.8792, lng: 47.5079, color: '#00FF00' }, // Antananarivo (vert)
      { lat: -18.8792, lng: 47.5079, color: '#FF0000' }, // Antananarivo (rouge)
      { lat: -18.8792, lng: 47.5079, color: '#FFFFFF' }, // Antananarivo (blanc)
      { lat: 40.7128, lng: -74.0060, color: '#00FF00' }, // New York
      { lat: 35.6762, lng: 139.6503, color: '#FF0000' }, // Tokyo
      { lat: 51.5074, lng: -0.1278, color: '#FFFFFF' }, // Londres
      { lat: -33.8688, lng: 151.2093, color: '#00FF00' }, // Sydney
      { lat: -26.2041, lng: 28.0473, color: '#FF0000' }, // Johannesburg
    ];

    const interval = setInterval(() => {
      if (!globeRef.current) return;
      globeRef.current.ringsData(ringCities);
    }, 1000);

    return () => clearInterval(interval);
  }, [isInitialized, data]);

  return <group ref={groupRef} />;
}

// Composant World
interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

function World({ globeConfig, data }: WorldProps) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new THREE.PerspectiveCamera(50, 1.2, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={new THREE.Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight} position={new THREE.Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight} position={new THREE.Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe config={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={300}
        maxDistance={300}
        autoRotate={globeConfig.autoRotate}
        autoRotateSpeed={globeConfig.autoRotateSpeed}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

// Composant principal
interface LandingPageProps {
  data?: Position[];
}

const LandingPage: React.FC<LandingPageProps> = ({ data = predictifyData }) => {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    setIsWebGLSupported(typeof WebGLRenderingContext !== 'undefined' && !!WebGLRenderingContext);
  }, []);

  const globeConfig: GlobeConfig = {
    pointSize: 1,
    globeColor: '#1E3A8A',
    showAtmosphere: true,
    atmosphereColor: '#3B82F6',
    atmosphereAltitude: 0.1,
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: 'rgba(255,255,255,0.7)',
    ambientLight: '#ffffff',
    directionalLeftLight: '#ffffff',
    directionalTopLight: '#ffffff',
    pointLight: '#ffffff',
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 4,
    autoRotate: true,
    autoRotateSpeed: 1,
  };

  return (
    <div className="landing-page">
      {isWebGLSupported ? (
        <div className="landing-content">
          <div className="text-container">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              ECONOMIE 2.0 : Le rôle des start-ups digitales dans la transformation de Madagascar
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              &ldquo;Anticipez la demande, dominez le marché&rdquo;
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/home">
                <button className="start-button">Commencer</button>
              </Link>
            </motion.div>
          </div>
          <div className="globe-container" aria-label="Globe interactif montrant les connexions globales de Predictify">
            <World globeConfig={globeConfig} data={data} />
          </div>
        </div>
      ) : (
        <div className="fallback-message">
          <h1>ECONOMIE 2.0 : Le rôle des start-ups digitales dans la transformation de Madagascar</h1>
          <p>&ldquo;Anticipez la demande, dominez le marché&rdquo;</p>
          <p>Votre navigateur ne supporte pas WebGL. Veuillez utiliser un navigateur moderne pour une expérience optimale.</p>
          <Link to="/home">
            <button className="start-button">Commencer</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LandingPage;