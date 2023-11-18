import Stats from "three/addons/libs/stats.module";
import { System } from "./system.js";

export class StatsSystem extends System {
  #stats = new Stats(); // Stats
  #container = document.createElement("div"); // Stats container
  #rendererInfoContainer = document.createElement("div"); // Container of additional renderer info

  constructor(cad) {
    super(cad);
  }

  // Getter of stats
  get stats() {
    return this.#stats;
  }

  /**
   * Initialize
   */
  init() {
    // Adjust styles of dom nodes
    this.#stats.dom.className = "stats";
    this.#rendererInfoContainer.className = "rendererInfo";
    this.#container.className = "statsContainer";
    // Append to dom tree
    this.#container.appendChild(this.#rendererInfoContainer);
    this.#container.appendChild(this.#stats.dom);
    this._cad.container.appendChild(this.#container);
  }

  /**
   * Update
   */
  update() {
    // Update stats
    this.#stats.update();

    // Update renderer info
    const { memory, render, programs } = this._cad.renderer.info;
    this.#rendererInfoContainer.innerHTML = `
      Frame number: ${render.frame} <br />
      Geometries: ${memory.geometries} <br />
      Textures: ${memory.textures} <br />
      Draw calls: ${render.calls} <br />
      Triangles: ${render.triangles} <br />
      Points: ${render.points} <br />
      Lines: ${render.lines} <br />
      Programs: ${programs?.length} <br />
    `;
  }

  /**
   * Dispose
   */
  dispose() {
    this.#container?.remove();
  }
}
