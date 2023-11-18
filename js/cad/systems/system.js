/**
 * Base system
 */
export class System {
  _cad; // Cad

  constructor(cad) {
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
  dispose() {}
}
