import CAD from "./cad/cad.js";
import { TOOLS } from "./constants/constants.js";

const root = document.getElementById("root");
const selectToolBtn = document.getElementById("select-tool");
const penToolBtn = document.getElementById("pen-tool");

const cad = new CAD(root);
cad.init();

selectToolBtn.addEventListener("click", () => {
  cad.setActiveTool(TOOLS.SELECT);
});

penToolBtn.addEventListener("click", () => {
  cad.setActiveTool(TOOLS.PEN);
});
