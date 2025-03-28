import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import fragmentShader from "/@/shaders/fragment.glsl";
import fragmentShaderGlass from "/@/shaders/fragmentGlass.glsl";
import vertexShader from "/@/shaders/vertex.glsl";
import vertexShaderGlass from "/@/shaders/vertexGlass.glsl";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { DotScreenShader } from "../CustomShader.ts";

export default class Canvas {
  constructor() {
    this.canvas = document.querySelector("canvas.webgl");
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.classList.add("webgl");
      document.body.appendChild(this.canvas);
    }

    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();
    this.loader = new GLTFLoader();
    this.isPlaying = true;

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.cubeTextureTarget = 0;

    this.createCamera();
    this.createRenderer();

    this.createCubeTexture();

    // create objects with 0 value in it as a float
    this.tCube = { tCube: 0.0 };

    this.Sphere = this.addObjects(vertexShader, fragmentShader, 2);
    // this.Glass = this.addObjects(
    //   vertexShaderGlass,
    //   fragmentShaderGlass,
    //   0.4,
    //   this.tCube
    // );

    // this.Glass = this.addGlassObject(0.4);

    this.addGlassObject(0.14, 0.08, 32, 64);

    this.addText("Annick\nPaccorabanne", new THREE.Vector3(0, 0, -0.4));
    this.initPost();

    this.onResize();
  }
  addGlassObject(
    radius = 1,
    tube = 0.4,
    radialSegments = 32,
    tubularSegments = 64
  ) {
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      transmission: 1.0, // ✅ Transparence totale
      roughness: 0.0, // ✅ Lisse
      thickness: 0.2, // ✅ Épaisseur du verre
      ior: 1.2, // ✅ Indice de réfraction
      chromaticAberration: 0.02, // ✅ Simulation d'aberration chromatique
      side: THREE.DoubleSide,
    });

    // Créer la géométrie du donut (tore)
    const geometry = new THREE.TorusGeometry(
      radius,
      tube,
      radialSegments,
      tubularSegments
    );

    // Créer le mesh avec la géométrie et le matériau
    const donutMesh = new THREE.Mesh(geometry, glassMaterial);

    // Ajouter le donut à la scène
    this.scene.add(donutMesh);

    // Pas besoin de retourner le mesh si vous ne voulez pas le manipuler plus tard
  }

  // Appeler la méthode pour créer un donut

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 1.2);
    this.scene.add(this.camera);
  }

  addText(text, position) {
    const loader = new FontLoader();

    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const lines = text.split("\n"); // Diviser le texte en lignes
        const lineHeight = 0.002; // Hauteur entre les lignes
        const textSize = 0.002; // Taille du texte

        lines.forEach((line, index) => {
          const textGeometry = new TextGeometry(line, {
            font: font,
            size: textSize,
            height: 0.0002,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.005,
            bevelSegments: 5,
          });

          // Centrer le texte horizontalement
          textGeometry.computeBoundingBox(); // Calculer la boîte de délimitation
          const textWidth =
            textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
          const offsetX = -textWidth / 2; // Décalage pour centrer

          const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);

          // Positionner chaque ligne
          textMesh.position.copy(position);

          textMesh.position.x += offsetX; // Appliquer le décalage pour centrer
          textMesh.position.y -= index * lineHeight; // Décaler chaque ligne vers le bas

          this.scene.add(textMesh);
        });
      }
    );
  }

  initPost() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const effect1 = new ShaderPass(DotScreenShader);
    effect1.uniforms["scale"].value = 4;
    this.composer.addPass(effect1);
  }

  createCubeTexture() {
    this.cubeTextureTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      encoding: THREE.sRGBEncoding,
    });

    this.cubecamera = new THREE.CubeCamera(1, 10, this.cubeTextureTarget);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x222222, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    window.addEventListener("resize", () => this.onResize());
  }

  addObjects(vertexShader, fragmentShader, sizeSphere, texture = null) {
    const uniforms = {
      time: { value: 0.0 }, // ✅ Uniforme de base
    };

    // ✅ Si une texture est fournie, on l'ajoute
    if (texture) {
      uniforms.tCube = { value: texture };
    }

    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: uniforms, // ✅ Utilisation des uniforms conditionnels
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.geometry = new THREE.SphereGeometry(sizeSphere, 32, 32);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    return this.mesh;
  }

  onResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.composer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  render(elapsedTime) {
    // ⏳ Accept elapsed time
    this.scene.traverse((object) => {
      if (object.isMesh && object.material.isShaderMaterial) {
        object.material.uniforms.time.value = elapsedTime * 0.5;
      }
    });

    // this.Glass.visible = false;
    // this.cubecamera.update(this.renderer, this.scene);
    // this.Glass.visible = true;
    // this.Glass.material.uniforms.tCube.value = this.cubeTextureTarget.texture;

    this.controls.update();
    this.composer.render(this.scene, this.camera);
    //this.renderer.render(this.scene, this.camera);
  }
}
