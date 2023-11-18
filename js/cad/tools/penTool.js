import * as THREE from "three";

import { MOUSE_BUTTON, TOOLS } from "../../constants/constants.js";

import { LineEntity } from "../entities/index.js";
import { Tool } from "./tool.js";

export class PenTool extends Tool {
  id = TOOLS.PEN;
  #lineEntity;

  constructor(cad) {
    super(cad);
  }

  /**
   * Initialize
   */
  init() {
    const {
      scene,
      cameraControls,
      pointerStateSystem,
      entities,
      tileEntityId,
    } = this._cad;

    // Mouse actions for camera controls
    cameraControls.mouseButtons = {
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE,
    };

    // Add line entity which representing drawal
    const lineEntity = new LineEntity(this._cad);
    lineEntity.init();
    scene.add(lineEntity);
    this.#lineEntity = lineEntity;

    // Store interactable entities for this tool
    pointerStateSystem.clearEntities();
    pointerStateSystem.addEntity(entities[tileEntityId]);
  }

  /**
   * Pointer down listener
   */
  onPointerDown(event, intersect) {}

  /**
   * Pointer move listener
   */
  onPointerMove(event, intersect) {
    if (intersect === null) return;

    this.#lineEntity.addGuidePoint(intersect.point);
  }

  /**
   * Pointer up listener
   */
  onPointerUp(event, intersect) {
    if (event.button !== MOUSE_BUTTON.LEFT || intersect === null) return;

    this.#lineEntity.addPoint(intersect.point);
  }

  /**
   * Update
   */
  update() {
    this.#lineEntity.update();
  }

  /**
   * Dispose
   */
  dispose() {
    this.#lineEntity.dispose();
  }
}
