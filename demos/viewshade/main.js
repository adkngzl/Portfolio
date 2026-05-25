// Lightweight public-safe Three.js placeholder demo.
// Replace or extend this file with your full viewshade / ray-casting workflow.

import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.165.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07111f);
scene.fog = new THREE.Fog(0x07111f, 18, 55);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(12, 9, 14);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.06;

const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0x1d2a42, roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

function makeBox(x, z, w, h, d, color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.68, metalness: 0.05 })
  );
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

makeBox(0, 0, 4.2, 8.5, 3.4, 0x6b7c93);
makeBox(-7, -2, 3.2, 5.8, 3.0, 0x3f5874);
makeBox(6.5, 3, 3.8, 7.0, 3.5, 0x4f6683);
makeBox(1.5, -8, 7.0, 3.2, 2.5, 0x2f445f);

// Simulated selected window point on the main building.
const windowPoint = new THREE.Vector3(2.15, 5.2, 0.45);
const windowMarker = new THREE.Mesh(
  new THREE.SphereGeometry(0.16, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0xa7f3d0, emissive: 0x335544 })
);
windowMarker.position.copy(windowPoint);
scene.add(windowMarker);

let rayGroup = new THREE.Group();
scene.add(rayGroup);

function updateSun() {
  const hour = Number(document.querySelector('#sunHour').value);
  const angle = THREE.MathUtils.mapLinear(hour, 6, 18, -Math.PI * 0.15, Math.PI * 1.15);
  sun.position.set(Math.cos(angle) * 12, 10, Math.sin(angle) * 12);
}

function regenerateRays() {
  rayGroup.clear();
  const rayCount = Number(document.querySelector('#rayCount').value);
  const radius = 9;

  for (let i = 0; i < rayCount; i++) {
    const az = (i / rayCount) * Math.PI * 2;
    const elevation = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-8, 18));
    const end = new THREE.Vector3(
      windowPoint.x + Math.cos(az) * Math.cos(elevation) * radius,
      windowPoint.y + Math.sin(elevation) * radius,
      windowPoint.z + Math.sin(az) * Math.cos(elevation) * radius
    );

    const geometry = new THREE.BufferGeometry().setFromPoints([windowPoint, end]);
    const material = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.34 });
    const line = new THREE.Line(geometry, material);
    rayGroup.add(line);
  }
}

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
window.addEventListener('click', event => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(windowMarker);
  if (hits.length) regenerateRays();
});

document.querySelector('#regen').addEventListener('click', regenerateRays);
document.querySelector('#rayCount').addEventListener('input', regenerateRays);
document.querySelector('#sunHour').addEventListener('input', updateSun);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

updateSun();
regenerateRays();
animate();
