import * as THREE from "three";

import { TOOLS, ZOOM_FACTOR } from "./constants/constants.js";

import CAD from "./cad/cad.js";

const root = document.getElementById("root");
const selectToolBtn = document.getElementById("select-tool");
const penToolBtn = document.getElementById("pen-tool");
const submitBuildingSettingsBtn = document.getElementById(
  "submit-building-settings"
);

const cad = new CAD(root);
cad.init();

// Handler for activating select tool
selectToolBtn.addEventListener("click", () => {
  cad.setActiveTool(TOOLS.SELECT);
});

// Handler for activating pen tool
penToolBtn.addEventListener("click", () => {
  cad.setActiveTool(TOOLS.PEN);
});

// Handler for updating building settings
submitBuildingSettingsBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const height = document.getElementById("height").value;
  const pitch = document.getElementById("pitch").value;
  const pitchAxis = document.querySelector(
    'input[name="pitch_axis"]:checked'
  ).value;

  cad.updateBuildingEntity(
    parseFloat(height) * ZOOM_FACTOR,
    pitchAxis === "x" ? [1, 0, 0] : [0, 0, 1],
    THREE.MathUtils.degToRad(parseFloat(pitch))
  );
});
