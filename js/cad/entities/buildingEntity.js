import * as THREE from "three";

import { Entity } from "./entity.js";
import { generateBuildingGeometryParameters } from "../../utils/utils.js";

export class BuildingEntity extends Entity {
  #mesh = new THREE.Mesh();
  #points = []; // Points of building base: Array<[x,y,z]>
  #height = 0; // Building height
  #pitch = 0; // Pitch radian
  #pitchDir = [0, 0, 1]; // Pitch direction: normalized vector components

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

  // Setter of points
  set points(val) {
    this.#points = val;
  }

  // Getter of height
  get height() {
    return this.#height;
  }

  // Setter of height
  set height(val) {
    this.#height = val;
  }

  // Getter of pitch
  get pitch() {
    return this.#pitch;
  }

  // Setter of pitch
  set pitch(val) {
    this.#pitch = val;
  }

  // Getter of pitchDir
  get pitchDir() {
    return this.#pitchDir;
  }

  // Setter of pitchDir
  set pitchDir(val) {
    this.#pitchDir = val;
  }

  /**
   * Initialize
   */
  init() {
    if (this.#points.length < 3) {
      console.error("Not enough points for building");
      return;
    }

    const { entities, tileEntityId } = this._cad;

    this.#mesh.geometry = new THREE.BufferGeometry();
    this.#mesh.material = new THREE.MeshBasicMaterial({
      map: entities[tileEntityId].mesh.material.map, // Passing tile texture to building
    });
    this.add(this.#mesh);
    this.matrixAutoUpdate = false;

    this.rebuild();
  }

  /**
   * Rebuild building shape
   */
  rebuild() {
    const { vertices, uvs } = generateBuildingGeometryParameters(
      this.#points,
      this.#height,
      this.#pitchDir,
      this.#pitch
    );

    this.#mesh.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    this.#mesh.geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    );
    this.#mesh.geometry.computeVertexNormals();
  }
}
