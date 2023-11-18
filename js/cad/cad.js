import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { StatsSystem } from "./systems/index.js";
import { TileEntity } from "./entities/index.js";

export default class CAD {
  // Essential renderer parameters
  #container; // HTML Dom which contains canvas
  #renderer; // Webgl renderer
  #scene; // Scene
  #camera; // Perspective camera
  #cameraControls; // Orbit control
  #width = 1; // Canvas width
  #height = 1; // Canvas height
  #pixelRatio = window.devicePixelRatio; // Display ratio
  #aspect = 1; // Camera aspect
  // Systems
  #statsSystem = null; // Stats
  // Entities
  #entities = {}; // Entities hashmap
  #tileEntityId = null;

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
    camera.position.set(1, 1, 1);
    scene.add(camera);

    // Initialize lights
    const directLight = new THREE.DirectionalLight(0xffffff, 1);
    const ambientLight = new THREE.AmbientLight(0x808080);
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
    this.initCameraControls();
    this.initStatsSystem();
    this.initEventListeners();

    this.#renderer.setAnimationLoop(this.update);
  }

  /**
   * Initialize entities
   */
  async initEntities() {
    // Add tile entity
    const tileEntity = new TileEntity(this);
    await tileEntity.init();
    this.#scene.add(tileEntity);
    this.#entities[tileEntity.id] = tileEntity;
    this.#tileEntityId = tileEntity.id;
  }

  /**
   * Initialize camera controls
   */
  initCameraControls() {
    const cameraControls = new OrbitControls(
      this.#camera,
      this.#renderer.domElement
    );
    this.#cameraControls = cameraControls;
  }

  /**
   * Initialize stats system
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

    // Update systems and helpers
    this.#statsSystem.update();
    this.#cameraControls.update();
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
    this.disposeEventListeners(); // Remove event listeners
    // Dispose all entities
    for (const key in this.#entities) {
      this.#entities[key].dispose();
    }
    this.#statsSystem.dispose(); // Dispose stats system
    this.#cameraControls.dispose(); // Dispose camera controls
    this.#renderer.domElement.remove(); // Remove the canvas
  }
}
