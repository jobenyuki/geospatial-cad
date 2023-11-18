import * as THREE from "three";

import { Entity } from "./entity.js";
import { Line2 } from "three/addons/lines/Line2";
import { LineGeometry } from "three/addons/lines/LineGeometry";
import { LineMaterial } from "three/addons/lines/LineMaterial";

export class LineEntity extends Entity {
  #mesh = new Line2();
  #points = [];

  constructor(cad) {
    super(cad);
  }

  // Getter of mesh
  get mesh() {
    return this.#mesh;
  }

  // Getter of points
  get points() {
    return this.#points;
  }

  /**
   * Initialize
   */
  init() {
    // TODO Fixme: Instantiating LineGeometry requires to setup initial instance count. This number is not mutable once setup.
    // this.#mesh.geometry = new LineGeometry();
    // this.#mesh.geometry.setPositions(this.#points);
    this.#mesh.material = new LineMaterial({
      color: 0xff0000,
      linewidth: 5,
      alphaToCoverage: false,
    });
    this.#mesh.material.resolution.set(this._cad.width, this._cad.height);
    this.add(this.#mesh);
    this.matrixAutoUpdate = false;
    this.updateMatrix();
  }

  /**
   * Add point
   */
  addPoint(point) {
    this.#points.push(point.x);
    this.#points.push(point.y);
    this.#points.push(point.z);

    if (this.#points.length < 6) return;

    // TODO Creating new geometry whenever mouse click should not be efficient. Research to fix this problem.
    this.#mesh.geometry.dispose();
    this.#mesh.geometry = new LineGeometry();
    this.#mesh.geometry.setPositions(this.#points);
  }

  /**
   * Update
   */
  update() {
    this.#mesh.material.resolution.set(this._cad.width, this._cad.height);
  }
}
