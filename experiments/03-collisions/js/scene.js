import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { createPlayer } from './player.js';

export async function setupScene(scene_path, canvas, player_path) {
    const loader = new GLTFLoader();
    await loader.load(new URL(scene_path, import.meta.url));

    const scene = loader.loadScene();
    if (!scene) throw new Error('A default scene is required');

    const camera = loader.loadNode('Camera');
    camera.aabb = {
        min: [0, 0, 0],
        max: [0, 0, 0],
    };

    const player = await createPlayer(player_path, canvas);
    player.aabb = {
        min: [-0.2, -0.2, -0.2],
        max: [0.2, 0.2, 0.2],
    };

    scene.push(player);
    return { scene, camera, player };
}