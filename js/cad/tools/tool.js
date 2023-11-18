/**
 * TODO Tool should be extended with sharable behaviors
 * Base tool
 */
export class Tool {
  id = "";
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
   * Pointer down listener
   */
  onPointerDown(event, intersect) {}

  /**
   * Pointer move listener
   */
  onPointerMove(event, intersect) {}

  /**
   * Pointer up listener
   */
  onPointerUp(event, intersect) {}

  /**
   * Key down listener
   */
  onKeyDown(event) {}

  /**
   * Key up listener
   */
  onKeyUp(event) {}

  /**
   * Update
   */
  update() {}

  /**
   * Dispose
   */
  dispose() {}
}
