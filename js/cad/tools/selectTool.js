import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Tool } from "./tool.js";

export class SelectTool extends Tool {
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
    const cameraControls = new OrbitControls(
      this._cad.camera,
      this._cad.renderer.domElement
    );
    this.#cameraControls = cameraControls;
  }

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
