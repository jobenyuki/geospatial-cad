import * as THREE from "three";

import { disposeObject } from "../../utils/utils.js";

/**
 * Base entity
 */
export class Entity extends THREE.Object3D {
  _cad; // Cad

  constructor(cad) {
    super();
    this._cad = cad;
  }

  // Getter of cad
  get cad() {
    return this._cad;
  }

  /**
   * Initialize
   */
  init() {}

  /**
   * Update
   */
  update() {}

  /**
   * Dispose
   */
  dispose() {
    disposeObject(this);
  }
}
