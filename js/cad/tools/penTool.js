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

    const isClosed = this.#lineEntity.addPoint(intersect.point);

    // If the polygon is done, make building
    if (isClosed) {
      this._cad.addBuildingEntity(this.#lineEntity.points);
      this.#lineEntity.dispose(); // TODO There is no undo/redo and edit functionality for the line entity yet. Recommended for better UX
    }
  }

  /**
   * Key down listener
   */
  onKeyDown(event) {
    if (event.key === "Escape") {
      this._cad.setActiveTool(TOOLS.SELECT);
    }
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
