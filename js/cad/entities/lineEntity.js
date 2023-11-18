import * as THREE from "three";

import { DUMMY_VECTOR3, SNAP_RANGE } from "../../constants/constants.js";

import { Entity } from "./entity.js";
import { Line2 } from "three/addons/lines/Line2";
import { LineGeometry } from "three/addons/lines/LineGeometry";
import { LineMaterial } from "three/addons/lines/LineMaterial";

export class LineEntity extends Entity {
  #mesh = new Line2(); // Main line
  #guideMesh = new Line2(); // Guide line
  #points = []; // Points array: Array<[x, y, z]>
  #canSnap = false;
  #isClosed = false;

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

  // Getter of isClosed
  get isClosed() {
    return this.#isClosed;
  }

  /**
   * Initialize
   */
  init() {
    // Main line mesh
    // TODO Fixme: Instantiating LineGeometry requires to setup initial instance count. This number is not mutable once setup.
    // this.#mesh.geometry = new LineGeometry();
    // this.#mesh.geometry.setPositions(this.#points.flat());
    this.#mesh.material = new LineMaterial({
      color: 0xff0000,
      linewidth: 5,
      alphaToCoverage: false,
    });
    this.#mesh.material.resolution.set(this._cad.width, this._cad.height);

    // Guide line mesh
    this.#guideMesh.material = new LineMaterial({
      color: 0xff0000,
      linewidth: 4,
      dashed: true,
      dashScale: 0.05,
      dashSize: 0.0003,
      gapSize: 0.0003,
      alphaToCoverage: true,
    });
    this.#guideMesh.material.resolution.set(this._cad.width, this._cad.height);
    this.#guideMesh.geometry = new LineGeometry().setPositions(
      new Array(6).fill(0)
    ); // 2 points are enough for the guide line

    this.add(this.#mesh, this.#guideMesh);
    this.matrixAutoUpdate = false;
  }

  /**
   * Add point
   */
  addPoint(point) {
    // Closed? then abort
    if (this.#isClosed) return;

    let points = [];
    // Try to close the line
    if (this.#canSnap) {
      points = [...this.#points, this.#points[0]];
      this.#isClosed = true;
    } else {
      this.#points.push(point.toArray());
      points = this.#points;
    }

    // At least 2 points are needed to draw line
    if (this.#points.length < 2) return;

    // TODO Creating new geometry whenever mouse click should not be efficient. Research to fix this problem.
    this.#mesh.geometry.dispose();
    this.#mesh.geometry = new LineGeometry();
    this.#mesh.geometry.setPositions(points.flat());

    return this.#isClosed;
  }

  /**
   * Add guide point
   */
  addGuidePoint(point) {
    // Closed? then abort
    if (this.#isClosed) return;

    const pointsLength = this.#points.length;

    // At least 1 point is needed to draw guide line
    if (pointsLength < 1) return;

    // Evaluate if the point can be snapped to first point
    if (pointsLength >= 3) {
      this.#canSnap =
        point.distanceTo(DUMMY_VECTOR3.fromArray(this.#points[0])) <=
        SNAP_RANGE;
    }

    const guidePoints = [
      this.#points[pointsLength - 1],
      this.#canSnap ? this.#points[0] : point.toArray(),
    ];
    this.#guideMesh.geometry.setPositions(guidePoints.flat());
    this.#guideMesh.computeLineDistances();
  }

  /**
   * Update
   */
  update() {
    this.#mesh.material.resolution.set(this._cad.width, this._cad.height);
    this.#guideMesh.material.resolution.set(this._cad.width, this._cad.height);
  }
}
