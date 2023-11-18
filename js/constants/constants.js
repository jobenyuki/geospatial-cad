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

export const MOUSE_BUTTON = {
  LEFT: 0, // Main button pressed, usually the left button or the un-initialized state
  MIDDLE: 1, // Auxiliary button pressed, usually the wheel button or the middle button (if present)
  RIGHT: 2, // Secondary button pressed, usually the right button
  BACK: 3, // Fourth button, typically the Browser Back button
  FORWARD: 4, // Fifth button, typically the Browser Forward button
};

export const SNAP_RANGE = 0.01;

// TODO This value is just placeholder for calculating meter roughly. Should follow API description like below:
// https://docs.mapbox.com/help/glossary/zoom-level/#zoom-levels-and-geographical-distance
export const ZOOM_FACTOR = 0.01;
