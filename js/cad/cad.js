import * as THREE from "three";

import { BuildingEntity, TileEntity } from "./entities/index.js";
import {
  KeyStateSystem,
  PointerStateSystem,
  StatsSystem,
} from "./systems/index.js";
import { PenTool, SelectTool } from "./tools/index.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TOOLS } from "../constants/constants.js";

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
  #statsSystem = new StatsSystem(this); // Stats
  #pointerStateSystem = new PointerStateSystem(this); // Pointer state
  #keyStateSystem = new KeyStateSystem(this); // Pointer state
  // Entities
  #entities = new Map(); // Entities hashmap
  #tileEntityId = null;
  #activeBuildingId = null;
  // Tools
  #activeTool = null;

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

    // Init camera controls
    const cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.maxPolarAngle = Math.PI / 2.5;
    this.#cameraControls = cameraControls;

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

  // Getter of camera controls
  get cameraControls() {
    return this.#cameraControls;
  }

  // Getter of entities
  get entities() {
    return this.#entities;
  }

  // Getter of tileEntityId
  get tileEntityId() {
    return this.#tileEntityId;
  }

  // Getter of pointerStateSystem
  get pointerStateSystem() {
    return this.#pointerStateSystem;
  }

  // Getter of keyStateSystem
  get keyStateSystem() {
    return this.#keyStateSystem;
  }

  // Getter of active tool
  get activeTool() {
    return this.#activeTool;
  }

  /**
   * Initialize
   */
  async init() {
    this.onWindowResize = this.onWindowResize.bind(this);
    this.update = this.update.bind(this);

    await this.#initEntities();
    this.#statsSystem.init();
    this.#pointerStateSystem.init();
    this.#keyStateSystem.init();
    this.#initEventListeners();

    // Set select tool as active one
    this.setActiveTool(TOOLS.SELECT);

    // Render loop
    this.#renderer.setAnimationLoop(this.update);
  }

  /**
   * Initialize entities
   */
  async #initEntities() {
    // Add tile entity
    const tileEntity = new TileEntity(this);
    await tileEntity.init();
    this.#scene.add(tileEntity);
    this.#entities[tileEntity.id] = tileEntity;
    this.#tileEntityId = tileEntity.id;
  }

  /**
   * Initialize event listeners
   */
  #initEventListeners() {
    window.addEventListener("resize", this.onWindowResize, false);
  }

  /**
   * Dispose event listeners
   */
  #disposeEventListeners() {
    window.removeEventListener("resize", this.onWindowResize, false);
  }

  /**
   * Window resize listener
   */
  onWindowResize() {
    this.#width = this.#container.offsetWidth;
    this.#height = this.#container.offsetHeight;
    const newAspect = this.#width / this.#height;
    this.#aspect = newAspect;

    this.#camera.aspect = this.#aspect;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(this.#width, this.#height);
  }

  /**
   * Set active tool
   */
  setActiveTool(tool) {
    let toolBtn = null;

    if (this.#activeTool !== null) {
      this.#activeTool.dispose();
      // Remove active class from tool button
      toolBtn = document.getElementById(`${this.#activeTool.id}-tool`);
      toolBtn.classList.remove("active");
    }
    this.#activeTool = this.#createTool(tool);
    this.#activeTool.init();

    // Add active class from tool button
    toolBtn = document.getElementById(`${tool}-tool`);
    toolBtn.classList.add("active");
  }

  /**
   * Create tool
   */
  #createTool(tool) {
    switch (tool) {
      case TOOLS.PEN:
        return new PenTool(this);
      default:
        return new SelectTool(this);
    }
  }

  /**
   * Add building entity with given points(Array<[x,y,z]>)
   * @param points
   */
  addBuildingEntity(points) {
    const entity = new BuildingEntity(this);
    entity.points = points;
    entity.init();
    this.#scene.add(entity);
    this.#entities[entity.id] = entity;
    this.#activeBuildingId = entity.id;
  }

  /**
   * Update building settings
   * @param height
   * @param pitchDir
   * @param pitch
   * @returns
   */
  updateBuildingEntity(height, pitchDir, pitch) {
    if (this.#activeBuildingId === null) {
      alert("Please select 3D building first");
      return;
    }

    const entity = this.#entities[this.#activeBuildingId];
    entity.height = height;
    entity.pitchDir = pitchDir;
    entity.pitch = pitch;
    entity.rebuild();
  }

  /**
   * Update
   */
  update() {
    this.render();

    // Update camera controls
    this.#cameraControls.update();
    // Update entities
    for (const key in this.#entities) {
      this.#entities[key].update();
    }
    // Update systems
    this.#statsSystem.update();
    this.#pointerStateSystem.update();
    this.#keyStateSystem.update();
    // Update active tool
    this.#activeTool.update();
  }

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
    this.#disposeEventListeners(); // Remove event listeners
    this.#cameraControls.dispose(); // Dispose camera controls
    // Dispose all entities
    for (const key in this.#entities) {
      this.#entities[key].dispose();
    }
    this.#statsSystem.dispose(); // Dispose stats system
    this.#pointerStateSystem.dispose(); // Dispose pointer state system
    this.#keyStateSystem.dispose(); // Dispose key state system
    this.#activeTool.dispose(); // Dispose active tool
    this.#renderer.domElement.remove(); // Remove the canvas
  }
}
