import * as THREE from "three";

import { StatsSystem } from "./systems/statsSystem.js";

export default class CAD {
  // Essential renderer parameters
  #container; // HTML Dom which contains canvas
  #renderer; // Webgl renderer
  #scene; // Scene
  #camera; // Perspective camera
  #width = 1; // Canvas width
  #height = 1; // Canvas height
  #pixelRatio = window.devicePixelRatio; // Display ratio
  #aspect = 1; // Camera aspect
  // Systems
  #statsSystem = null; // Stats

  constructor(container) {
    this.#container = container;
    this.#width = container.offsetWidth || 1;
    this.#height = container.offsetHeight || 1;
    this.#aspect = this.#width / this.#height;

    /**
     * Initialize elements for basic renderer
     */
    // Initialize webgl renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !(this.#pixelRatio > 1),
      alpha: true, // make the background transparent
    });
    renderer.setPixelRatio(this.#pixelRatio);
    renderer.setSize(this.#width, this.#height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Initialize scene
    const scene = new THREE.Scene();

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(45, this.#aspect, 0.1, 1000);
    camera.position.set(0, 0, 10);
    scene.add(camera);

    // Initialize lights
    const directLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(directLight);
    scene.add(ambientLight);

    this.#renderer = renderer;
    this.#scene = scene;
    this.#camera = camera;
  }

  // Getter of container
  get container() {
    return this.#container;
  }

  // Getter of width
  get width() {
    return this.#width;
  }

  // Getter of height
  get height() {
    return this.#height;
  }

  // Getter of pixelRatio
  get pixelRatio() {
    return this.#pixelRatio;
  }

  // Getter of aspect
  get aspect() {
    return this.#aspect;
  }

  // Getter of webgl renderer
  get renderer() {
    return this.#renderer;
  }

  // Getter of Scene
  get scene() {
    return this.#scene;
  }

  // Getter of camera
  get camera() {
    return this.#camera;
  }

  /**
   * Initialize
   */
  async init() {
    await this.initEntities();
    this.initStatsSystem();
    this.initEventListeners();

    this.#renderer.setAnimationLoop(this.update);
  }

  /**
   * Initialize entities
   */
  async initEntities() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.#scene.add(cube);
  }

  /**
   * Initialize stats syste,
   */
  initStatsSystem() {
    const statsSystem = new StatsSystem(this);
    statsSystem.init();
    this.#statsSystem = statsSystem;
  }

  /**
   * Initialize event listeners
   */
  initEventListeners = () => {
    window.addEventListener("resize", this.onWindowResize, false);
  };

  /**
   * Dispose event listeners
   */
  disposeEventListeners = () => {
    window.removeEventListener("resize", this.onWindowResize, false);
  };

  /**
   * Window resize listener
   */
  onWindowResize = () => {
    this.#width = this.#container.offsetWidth;
    this.#height = this.#container.offsetHeight;
    const newAspect = this.#width / this.#height;
    this.#aspect = newAspect;

    this.#camera.aspect = this.#aspect;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(this.#width, this.#height);
  };

  /**
   * Tick
   */
  update = () => {
    this.render();

    // Update systems
    this.#statsSystem.update();
  };

  /**
   * Render
   */
  render() {
    this.#renderer.render(this.#scene, this.#camera);
  }

  /**
   * Dispose
   */
  dispose() {
    // Remove event listeners
    this.disposeEventListeners();
    // Dispose stats system
    this.#statsSystem.dispose();
    // Remove the canvas
    this.#renderer.domElement.remove();
  }
}
