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

    const vertices = generateBuildingGeometryParameters(
      this.#points,
      this.#height,
      this.#pitchDir,
      this.#pitch
    );

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    geometry.computeVertexNormals();
    // TODO
    // const normalNumComponents = 3;
    // const uvNumComponents = 2;
    // // geometry.setAttribute(
    // //   "normal",
    // //   new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
    // // );
    // // geometry.setAttribute(
    // //   "uv",
    // //   new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
    // // );

    this.#mesh.geometry = geometry;
    this.#mesh.material = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      side: THREE.DoubleSide,
    });
    this.add(this.#mesh);
    this.matrixAutoUpdate = false;
  }

  /**
   * Rebuild building
   */
  rebuild() {
    const vertices = generateBuildingGeometryParameters(
      this.#points,
      this.#height,
      this.#pitchDir,
      this.#pitch
    );

    this.#mesh.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    this.#mesh.geometry.computeVertexNormals();
  }
}
