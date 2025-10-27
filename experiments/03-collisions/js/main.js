import { setupRenderer } from './renderer.js';
import { setupScene } from './scene.js';
import { setupUpdateSystem } from './update.js';
import { setupResizeSystem } from './resize.js';
import { setupBoundingBoxes } from './boundingBoxes.js';
import { setupPhysics } from './physicsSetup.js';
import { setupCamera } from './camera.js';

const canvas = document.querySelector('canvas');
const renderer = await setupRenderer(canvas);
const { scene, camera, player } = await setupScene('../scene/scene.gltf', canvas, '../../../models/cat/cat.gltf');
const physics = setupPhysics(scene);
setupCamera(camera, player, canvas, {
    distance: 5,
    height: 1,
    smooth: 0.1,
});

setupBoundingBoxes(scene);
setupResizeSystem(canvas, camera);
setupUpdateSystem({ scene, physics, renderer, camera });