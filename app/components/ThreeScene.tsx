"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// Shader personnalisé (adapté de votre CustomShader.ts)
const DotScreenShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new THREE.Vector2(256, 256) },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    angle: { value: 1.57 },
    scale: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec2 center;
    uniform float angle;
    uniform float scale;
    uniform vec2 tSize;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    
    float random(vec2 p) {
      vec2 k1 = vec2(
        23.14069263277926,
        2.665144142690225
      );
      return fract(
        cos(dot(p, k1)) * 12345.6789
      );
    }
    
    float pattern() {
      float s = sin(angle), c = cos(angle);
      vec2 tex = vUv * tSize - center;
      vec2 point = vec2(c * tex.x - s * tex.y, s * tex.x + c * tex.y) * scale;
      return (sin(point.x) * sin(point.y)) * 4.0;
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 uvrandom = vUv;
      uvrandom.y *= random(vec2(uvrandom.y, 0.4));
      float average = (color.r + color.g + color.b) / 3.0;
      gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);
    }
  `,
};

// Shaders principaux
const vertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
  
  float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
  
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
  
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
  
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
  
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
  
    return o4.y * d.y + o4.x * (1.0 - d.y);
  }
  
  float lines(vec2 uv, float offset) {
    return smoothstep(
      0., 0.5 + offset*0.5,
      abs(0.5*(sin(uv.x * 30.)+ offset*2.))
    );
  }
  
  mat2 rotate2D(float angle){
    return mat2(cos(angle),-sin(angle),
    sin(angle),cos(angle)
    );
  }
  
  void main() {
    float n = noise(vPosition + time);
  
    vec3 baseFirst = vec3(120./255., 158./255., 113./255.);
    vec3 accent = vec3(0., 0., 0.); 
    vec3 baseSecond = vec3(224./255., 148./255., 66./255.); 
  
    vec2 baseUV = rotate2D(n)*vPosition.xy*0.1;
    float basePattern = lines(baseUV, 0.5);
    float secondPattern = lines(baseUV, 0.1);
  
    vec3 baseColor = mix(baseSecond,baseFirst,basePattern);
    vec3 secondBaseColor = mix(baseColor,accent,secondPattern);
  
    gl_FragColor = vec4(vec3(secondBaseColor),1.);
  }
`;

export default function ThreeScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialisation
    const container = containerRef.current;

    // Création de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // Tailles
    const sizes = {
      width: container.clientWidth,
      height: container.clientHeight
    };

    // Caméra
    const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 0, 1.2);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Contrôles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Sphere animée avec shader
    const addObjects = (vShader, fShader, sizeSphere) => {
      const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          time: { value: 0.0 }
        },
        vertexShader: vShader,
        fragmentShader: fShader,
      });

      const geometry = new THREE.SphereGeometry(sizeSphere, 32, 32);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      return mesh;
    };

    // Ajouter un tore en verre
    const addGlassObject = (radius = 0.14, tube = 0.08, radialSegments = 32, tubularSegments = 64) => {
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        transmission: 1.0,
        roughness: 0.0,
        thickness: 0.2,
        ior: 1.2,
        chromaticAberration: 0.02,
        side: THREE.DoubleSide,
      });

      const geometry = new THREE.TorusGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments
      );

      const donutMesh = new THREE.Mesh(geometry, glassMaterial);
      scene.add(donutMesh);

      return donutMesh;
    };

    // Ajouter le texte
    const addText = (text, position) => {
      const loader = new FontLoader();

      loader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          const lines = text.split("\n");
          const lineHeight = 0.25;
          const textSize = 0.2;

          lines.forEach((line, index) => {
            const textGeometry = new TextGeometry(line, {
              font: font,
              size: textSize,
              depth: 0.02,
              height: 0.0002,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.01,
              bevelSize: 0.005,
              bevelSegments: 5,
            });

            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            const offsetX = -textWidth / 2;

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textMesh.position.copy(position);
            textMesh.position.x += offsetX;
            textMesh.position.y -= index * lineHeight;

            scene.add(textMesh);
          });
        }
      );
    };

    // Postprocessing
    const initPost = () => {
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      const effect1 = new ShaderPass(DotScreenShader);
      effect1.uniforms["scale"].value = 4;
      composer.addPass(effect1);

      return composer;
    };

    // Création des objets
    const sphere = addObjects(vertexShader, fragmentShader, 2);
    const glassDonut = addGlassObject();
    addText("Annick\nPaccorabanne", new THREE.Vector3(0, 0, -0.4));

    // Post-processing
    const composer = initPost();

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Mise à jour du shader
      if (sphere.material.uniforms) {
        sphere.material.uniforms.time.value = elapsedTime * 0.5;
      }

      // Rotation du donut
      if (glassDonut) {
        glassDonut.rotation.x = elapsedTime * 0.3;
        glassDonut.rotation.y = elapsedTime * 0.2;
      }

      // Mise à jour des contrôles
      controls.update();

      // Rendu
      composer.render();

      requestAnimationFrame(animate);
    };

    // Gestion du redimensionnement
    const handleResize = () => {
      sizes.width = container.clientWidth;
      sizes.height = container.clientHeight || 400;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      composer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Lancer l'animation
    animate();

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);

      // Nettoyer la scène
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material.uniforms && object.material.uniforms.tDiffuse) {
            object.material.uniforms.tDiffuse.value?.dispose();
          }
          object.material.dispose();
        }
      });

      renderer.dispose();
      composer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '80vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
} 