import * as THREE from "three";

import Sizes from "./Utils/Sizes";
import Times from "./Utils/Times.js";
import Camera from "./Camera/Camera.js";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;

    window.experience = this;

    this.canvas = canvas;

    this.sizes = new Sizes();
    this.times = new Times();
    this.scene = new THREE.Scene();
    this.camera = new Camera();

    this.sizes.on("resize", this.resize);
    this.times.on("tick", this.update);
  }

  resize() {
    this.camera.resize();
  }

  update() {
    this.camera.update();
  }
}
