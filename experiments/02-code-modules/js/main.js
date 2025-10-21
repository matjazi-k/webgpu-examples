import { setupRenderer } from './renderer.js';
import { setupScene } from './scene.js';
import { setupCamera } from './camera.js';
import { setupUpdateSystem } from './update.js';
import { setupResizeSystem } from './resize.js';
import { setupInput } from './input.js';

const canvas = document.querySelector('canvas');
const renderer = await setupRenderer(canvas);
const { scene, cat } = await setupScene();
const camera = setupCamera(scene, canvas);

const cameraTarget = [0, 0.3, 0.9];
let rotation = { speed: 0.01 };

setupUpdateSystem(renderer, scene, camera, cat, cameraTarget, () => rotation.speed);
setupResizeSystem(canvas, camera);
setupInput(cameraTarget, rotation);