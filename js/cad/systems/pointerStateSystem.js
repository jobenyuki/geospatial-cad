import * as THREE from "three";

import { System } from "./system.js";

export class PointerStateSystem extends System {
  #mouse = new THREE.Vector2(); // Vector2 for tracking mouse position
  #raycaster = new THREE.Raycaster(); // Raycaster object
  #isDown = false; // Mouse down state
  #isDragging = false; // Mouse drag state
  #entities = new Set(); // List of 3D entities we can interact with
  #hovEntities = new Set(); // List of hoverable entities

  constructor(cad) {
    super(cad);
  }

  // Getter of entities as array
  get entityArr() {
    return [...this.#entities];
  }

  /**
   * Initialize
   */
  init() {
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.#initEventListeners();
  }

  /**
   * Initialize event listeners
   */
  #initEventListeners() {
    const domElement = this._cad.renderer.domElement;

    domElement.addEventListener("pointerdown", this.onPointerDown);
    domElement.addEventListener("pointermove", this.onPointerMove);
    domElement.addEventListener("pointerup", this.onPointerUp);
  }

  /**
   * Dispose event listeners
   */
  #disposeEventListeners() {
    domElement.removeEventListener("pointerdown", this.onPointerDown);
    domElement.removeEventListener("pointermove", this.onPointerMove);
    domElement.removeEventListener("pointerup", this.onPointerUp);
  }

  eventToPointerVP(event) {
    const boundingRect = this._cad.renderer.domElement.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;

    return new THREE.Vector2(x, y);
  }

  eventToPointer(event) {
    const pointerId =
      event instanceof PointerEvent ? event.pointerId : event.button;
    return {
      pointerId,
      pointerVP: this.eventToPointerVP(event),
    };
  }

  /**
   * Get intersection
   * @param event
   * @returns
   */
  getIntersection(event) {
    const boundingRect = this._cad.renderer.domElement.getBoundingClientRect();

    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;

    this.#mouse.set(
      (x / boundingRect.width) * 2 - 1,
      -(y / boundingRect.height) * 2 + 1
    );
    this.#raycaster.setFromCamera(this.#mouse, this._cad.camera);
    const intersects = this.#raycaster.intersectObjects(this.entityArr, true);

    if (!intersects.length) return null;

    return intersects[0];
  }

  /**
   * Add entity that can be interactive (on click, hover etc...)
   * @param entity
   */
  addEntity(entity, hoverable = false) {
    this.#entities.add(entity);

    if (hoverable) {
      this.#hovEntities.add(entity);
    }
  }

  /**
   * Remove entity that can be interactive (on click, hover etc...)
   * @param entity
   */
  removeEntity(entity) {
    this.#entities.delete(entity);
    this.#hovEntities.delete(entity);
  }

  /**
   * Clear all interactable entities
   */
  clearEntities() {
    this.#entities.clear();
    this.#hovEntities.clear();
  }

  /**
   * Pointer down listener
   */
  onPointerDown(event) {
    this.isDown = true;
    this.isDragging = false;

    const intersect = this.getIntersection(event);
    this._cad.activeTool.onPointerDown(event, intersect);
  }

  /**
   * Pointer move listener
   */
  onPointerMove(event) {
    this.isDragging = true;

    const intersect = this.getIntersection(event);
    this._cad.activeTool.onPointerMove(event, intersect);
  }

  /**
   * Pointer up listener
   */
  onPointerUp(event) {
    this.isDown = false;
    this.isDragging = false;

    const intersect = this.getIntersection(event);
    this._cad.activeTool.onPointerUp(event, intersect);
  }

  /**
   * Dispose
   */
  dispose() {
    this.#disposeEventListeners(); // Remove event listeners
  }
}
