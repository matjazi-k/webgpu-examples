import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { UnlitRenderer } from 'engine/renderers/UnlitRenderer.js';
//import { FirstPerson3dController } from 'engine/controllers/FirstPerson3dController.js';
import { setupCamera, addSceneEntity, addController } from './scene.js';

import { Camera, Model } from 'engine/core/core.js';

import {
    calculateAxisAlignedBoundingBox,
    mergeAxisAlignedBoundingBoxes,
} from 'engine/core/MeshUtils.js';

import { Physics } from './Physics.js';

const canvas = document.querySelector('canvas');
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load(new URL('./scene/scene.gltf', import.meta.url));

const scene = loader.loadScene();
const player = await addSceneEntity('/models/cat/cat.gltf', scene, {
    scale: [4, 3.7, 3.7],
    rotation: [0, 0, 0, 1],
    translation: [2, 0, 2],
});
player.aabb = {
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
};
player.customProperties = {isDynamic: true};
const camera = await setupCamera(scene, player, canvas);
camera.aabb = {
    min: [0, 0, 0],
    max: [0, 0, 0],
};

await addController(player, canvas);

const physics = new Physics(scene);
for (const entity of scene) {
    const model = entity.getComponentOfType(Model);
    if (!model) {
        continue;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    entity.aabb = mergeAxisAlignedBoundingBoxes(boxes);
}

function update(time, dt) {
    for (const entity of scene) {
        for (const component of entity.components) {
            component.update?.(time, dt);
        }
    }

    const collisions = physics.update(time, dt);

    const collisionsByEntity = new Map();
    for (const c of collisions) {
        if (!collisionsByEntity.has(c.entityA)) collisionsByEntity.set(c.entityA, []);
        collisionsByEntity.get(c.entityA).push(c);
    }

    for (const [entity, entityCollisions] of collisionsByEntity) {
        const controller = entity.components.find(
            c => c.constructor.name === 'ThirdPersonLikeController'
        );

        if (controller) {
            controller.handleCollisions(entityCollisions);
        }
    }

}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
