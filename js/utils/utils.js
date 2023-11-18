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
