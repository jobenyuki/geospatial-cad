import { System } from "./system.js";

export class KeyStateSystem extends System {
  constructor(cad) {
    super(cad);
  }

  /**
   * Initialize
   */
  init() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.#initEventListeners();
  }

  /**
   * Initialize event listeners
   */
  #initEventListeners() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  /**
   * Dispose event listeners
   */
  #disposeEventListeners() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  /**
   * Key down listener
   */
  onKeyDown(event) {
    this._cad.activeTool.onKeyDown(event);
  }

  /**
   * Key up listener
   */
  onKeyUp(event) {
    this._cad.activeTool.onKeyUp(event);
  }

  /**
   * Dispose
   */
  dispose() {
    this.#disposeEventListeners(); // Remove event listeners
  }
}
