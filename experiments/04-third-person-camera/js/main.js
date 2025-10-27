import { setupRenderer } from './renderer.js';
import { setupScene, setupCamera, addSceneEntity, addController } from './scene.js';
import { setupUpdateSystem } from './update.js';
import { setupResizeSystem } from './resize.js';

const canvas = document.querySelector('canvas');
const renderer = await setupRenderer(canvas);
const scene = await setupScene('../scene/scene.gltf');
const player = await addSceneEntity('/models/cat/cat.gltf', scene, {
    scale: [4, 3.7, 3.7],
    rotation: [0, 0, 0, 1],
    translation: [0, 0, 0],
});
const camera = await setupCamera(scene, player[0], canvas);

await addController(player, canvas);

setupUpdateSystem(renderer, scene, camera);
setupResizeSystem(canvas, camera);