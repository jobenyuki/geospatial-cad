import CAD from "./cad/cad.js";
import { Tools } from "./constants/constants.js";

const root = document.getElementById("root");
const selectToolBtn = document.getElementById("select-tool");
const penToolBtn = document.getElementById("pen-tool");

const cad = new CAD(root);
cad.init();

selectToolBtn.addEventListener("click", () => {
  cad.setActiveTool(Tools.SELECT);
});

penToolBtn.addEventListener("click", () => {
  cad.setActiveTool(Tools.PEN);
});
