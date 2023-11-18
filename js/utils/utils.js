import * as THREE from "three";

import {
  DEFAULT_MAPBOX_SETTINGS,
  MAPBOX_SATELLITE_API_HOST,
  MAPBOX_TOKEN,
} from "../constants/constants.js";

import { pointToTile } from "mapbox/tilebelt";

// Load texture
export async function loadTexture(src) {
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(src);

  return texture;
}

// Load mapbox tile as canvas texture
export function loadTileTexture(
  lat = DEFAULT_MAPBOX_SETTINGS.lat,
  lon = DEFAULT_MAPBOX_SETTINGS.lon,
  zoom = DEFAULT_MAPBOX_SETTINGS.zoom
) {
  const tiles = pointToTile(lon, lat, zoom);
  const satelliteTileSrc = `${MAPBOX_SATELLITE_API_HOST}/${zoom}/${tiles[0]}/${tiles[1]}.jpg90?access_token=${MAPBOX_TOKEN}`;

  return loadTexture(satelliteTileSrc);
}

// Dispose texture
export function disposeTexture(texture) {
  texture?.dispose();
}

// Dispose material
export function disposeMaterial(material) {
  if (!material) return;

  let materialArr = [];

  if (Array.isArray(material)) {
    materialArr = material;
  } else {
    materialArr[0] = material;
  }

  // Iterate all materials and their props
  for (const el of materialArr) {
    for (const [key, val] of Object.entries(el)) {
      // Filter out map props only
      if ((!key.endsWith("Map") && !key.endsWith("map")) || !val) continue;

      disposeTexture(val);
    }

    el.dispose();
  }
}

// Dispose object
export function disposeObject(object) {
  if (!object) return;

  object.removeFromParent();

  object.traverse((child) => {
    if (child.isMesh) {
      const { geometry, material } = child;

      geometry.dispose();
      disposeMaterial(material);
    }
  });
}

// Cacluate magnitude
export function magnitude(a) {
  return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
}

// Calculate normalize vector
export function normalize(a) {
  return a.map((coord) => coord / magnitude(a));
}

// Calculate dot product
export function dotProduct(a, b, axes = "xyz") {
  if (axes === "xy") {
    return a[0] * b[0] + a[1] * b[1];
  }

  if (axes === "yz") {
    return a[1] * b[1] + a[2] * b[2];
  }

  if (axes === "xz") {
    return a[0] * b[0] + a[2] * b[2];
  }

  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// Title plane
export function tiltPlane(points, dir, pitch) {
  const tanTheta = Math.tan(pitch);

  const originalY = points[0][1];
  const deltaYs = [];

  for (const point of points) {
    const dp = dotProduct(point, dir, "xz");
    deltaYs.push(dp * tanTheta);
  }

  const minDeltaY = Math.min(...deltaYs);
  const maxDeltaY = Math.max(...deltaYs);

  // Evaluate if tilt angle is good to process
  if (maxDeltaY - minDeltaY > originalY) {
    console.error("Invalid pitch");
  }

  const newVertices = points.map((point, i) => {
    return [point[0], point[1] + deltaYs[i] - maxDeltaY, point[2]];
  });

  return newVertices;
}

// Triangulate
// TODO Holes, Indexed triangulation
export function triangulate(points) {
  const vertices = [];

  if (points.length < 3) return vertices;

  let i = 1;
  while (i < points.length - 1) {
    vertices.push(...points[0]);
    vertices.push(...points[i]);
    vertices.push(...points[i + 1]);
    i++;
  }

  return vertices;
}

// Generate top points of building
export function generateBuildingTopPoints(points, height, dir, pitch) {
  // Extrude first
  const extrusionPoints = [];
  for (const point of points) {
    extrusionPoints.push([point[0], point[1] + height, point[2]]);
  }

  // Tilt then
  const topPoints = tiltPlane(extrusionPoints, dir, pitch);

  return topPoints;
}

// Generate top points of building
export function generateBuildingSideVertices(points, topPoints) {
  const vertices = [];

  for (let i = 0; i < points.length; i++) {
    const nextIndex = i === points.length - 1 ? 0 : i + 1;
    const sidePoints = [
      points[i],
      points[nextIndex],
      topPoints[nextIndex],
      topPoints[i],
    ];
    vertices.push(...triangulate(sidePoints));
  }

  return vertices;
}

// Generate building geometry params
export function generateBuildingGeometryParameters(
  points,
  height,
  dir = [0, 0, 1],
  pitch = 0
) {
  const topPoints = generateBuildingTopPoints(points, height, dir, pitch);

  const vertices = [];
  // vertices.push(...triangulate(points)); // TODO Confirm: no need to render base
  vertices.push(...triangulate(topPoints));
  vertices.push(...generateBuildingSideVertices(points, topPoints));

  return vertices;
}
