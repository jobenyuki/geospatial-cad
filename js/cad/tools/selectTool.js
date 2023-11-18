import * as THREE from "three";

import { TOOLS } from "../../constants/constants.js";
import { Tool } from "./tool.js";

export class SelectTool extends Tool {
  id = TOOLS.SELECT;

  constructor(cad) {
    super(cad);
  }

  /**
   * Initialize
   */
  init() {
    const { cameraControls } = this._cad;

    // Mouse actions for camera controls
    cameraControls.mouseButtons = {
      LEFT: THREE.MOUSE.DOLLY,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE,
    };
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
  update() {}

  /**
   * Dispose
   */
  dispose() {}
}
