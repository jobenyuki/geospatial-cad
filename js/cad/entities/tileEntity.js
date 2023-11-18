import * as THREE from "three";

import { Entity } from "./entity.js";
import { loadTileTexture } from "../../utils/utils.js";

export class TileEntity extends Entity {
  #mesh = new THREE.Mesh();

  constructor(cad) {
    super(cad);
  }

  // Getter of mesh
  get mesh() {
    return this.#mesh;
  }

  /**
   * Initialize
   */
  async init() {
    const texture = await loadTileTexture();
    this.#mesh.material = new THREE.MeshBasicMaterial({ map: texture });
    this.#mesh.geometry = new THREE.PlaneGeometry(1, 1);
    this.add(this.#mesh);
    this.rotateX(-Math.PI / 2);
    this.matrixAutoUpdate = false;
    this.updateMatrix();
  }
}
