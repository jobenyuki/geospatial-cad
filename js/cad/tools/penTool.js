import * as THREE from "three";

import { LineEntity } from "../entities/index.js";
import { TOOLS } from "../../constants/constants.js";
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
    const { scene, pointerStateSystem, entities, tileEntityId } = this._cad;

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
    if (intersect === null) return;

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
