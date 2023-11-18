import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TOOLS } from "../../constants/constants.js";
import { Tool } from "./tool.js";

export class SelectTool extends Tool {
  id = TOOLS.SELECT;
  #cameraControls; // Orbit control

  constructor(cad) {
    super(cad);
  }

  // Getter of camera controls
  get cameraControls() {
    return this.#cameraControls;
  }

  /**
   * Initialize
   */
  init() {
    const { camera, renderer, pointerStateSystem, entities } = this._cad;

    // Init camera controls
    const cameraControls = new OrbitControls(camera, renderer.domElement);
    this.#cameraControls = cameraControls;

    // TODO
    // // Set intersectable objects
    // pointerStateSystem.clearEntities()

    // pointerStateSystem.add(entities)
  }

  /**
   * Pointer down listener
   */
  onPointerDown(event, intersect) {}

  /**
   * Pointer move listener
   */
  onPointerMove(event, intersect) {}

  /**
   * Pointer up listener
   */
  onPointerUp(event, intersect) {}

  /**
   * Update
   */
  update() {
    this.#cameraControls.update();
  }

  /**
   * Dispose
   */
  dispose() {
    this.#cameraControls.dispose();
  }
}
