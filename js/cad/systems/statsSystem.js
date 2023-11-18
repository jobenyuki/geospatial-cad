import Stats from "three/addons/libs/stats.module";

export class StatsSystem {
  #cad; // Cad
  #stats = new Stats(); // Stats
  #container = document.createElement("div"); // Stats container
  #rendererInfoContainer = document.createElement("div"); // Container of additional renderer info

  constructor(cad) {
    this.#cad = cad;
  }

  // Getter of cad
  get cad() {
    return this.#cad;
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
    this.#stats.dom.style.position = "relative";
    this.#rendererInfoContainer.style.fontSize = "11px";
    this.#rendererInfoContainer.style.userSelect = "none";
    this.#container.style.position = "absolute";
    this.#container.style.bottom = "0px";
    this.#container.style.top = "auto";
    // Append to dom tree
    this.#container.appendChild(this.#rendererInfoContainer);
    this.#container.appendChild(this.#stats.dom);
    this.#cad.container.appendChild(this.#container);
  }

  /**
   * Update
   */
  update() {
    // Update stats
    this.#stats.update();

    // Update renderer info
    const { memory, render, programs } = this.#cad.renderer.info;
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
