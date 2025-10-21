import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Transform } from 'engine/core/core.js';

export async function setupScene() {
    const loader = new GLTFLoader();
    await loader.load(new URL('../../../models/cat/cat.gltf', import.meta.url));

    const scene = loader.loadScene();
    if (!scene) throw new Error('A default scene is required');

    const cat = scene[0];
    if (!cat) throw new Error('Cat model not found');

    const catTransform = cat.getComponentOfType(Transform);
    return { scene, cat: { entity: cat, transform: catTransform } };
}
