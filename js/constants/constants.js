import * as THREE from "three";

export const MAPBOX_SATELLITE_API_HOST =
  "https://api.mapbox.com/v4/mapbox.satellite";

export const MAPBOX_TOKEN =
  "pk.eyJ1Ijoiam9iZW55dWtpIiwiYSI6ImNrcnYxMjEycDAyODIycHJ2MGExZ2xrNGIifQ.XT4UOZq2oruZLehDZ_43VA";

export const DEFAULT_MAPBOX_SETTINGS = {
  lat: 49.2514003,
  lon: -123.1001613,
  zoom: 18,
};

export const DUMMY_VECTOR3 = new THREE.Vector3();

export const TOOLS = {
  SELECT: "select",
  PEN: "pen",
};

export const SNAP_RANGE = 0.01;
