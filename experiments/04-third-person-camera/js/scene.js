import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Camera, Entity, Transform, Parent } from 'engine/core/core.js';
//import { FirstPersonControllerLimitedRotation } from 'engine/controllers/FirstPersonControllerLimitedRotation.js';
import { TopDownCameraController } from 'engine/controllers/TopDownCameraController.js';
import { TopDownPlayerController } from 'engine/controllers/TopDownPlayerController.js';

export async function setupScene(scenePath) {
    const loader = new GLTFLoader();
    await loader.load(new URL(scenePath, import.meta.url));
    const scene = loader.loadScene();
    if (!scene) throw new Error('A default scene is required');

    return scene;
}

export async function setupCamera(scene, player, canvas) {
    // Checks if camera exists
    let cameraEntity = scene.find(entity => entity.getComponentOfType(Camera));

    // Creates new camera if there is none
    if (!cameraEntity) {
        console.log('No camera found, creating one manually...');

        // Creates new Entity, Transform and Camera objects for camera
        cameraEntity = new Entity();
        const cameraTransform = new Transform();
        const cameraComponent = new Camera({ 
            aspect: canvas.width / canvas.height,
            fov: 60 * Math.PI / 180,
            near: 0.1,
            far: 100,
        });

        // Attaches Transform and Camera component to camera Entity
        cameraEntity.addComponent(cameraTransform);
        cameraEntity.addComponent(cameraComponent);
    }

    cameraEntity.addComponent(new TopDownCameraController(cameraEntity, player, canvas));

    return cameraEntity;
}

export async function addSceneEntity(path, scene, options = {}) {
    const loader = new GLTFLoader();
    await loader.load(new URL(path, import.meta.url));

    // load root nodes from GLTF
    const newEntities = loader.loadScene();
    if (!newEntities.length) throw new Error('No entities found in model');

    const rootEntity = scene[0]; // usually world root

    // Attach each new entity as a child of the rootEntity
    for (const entity of newEntities) {
        entity.addComponent(new Parent(rootEntity));
        const transform = entity.getComponentOfType(Transform);
        if (options.translation) transform.translation = options.translation;
        if (options.rotation) transform.rotation = options.rotation;
        if (options.scale) transform.scale = options.scale;
        scene.push(entity);
    }

    return newEntities;
}

export async function addController(entities, canvas) {
    for (const entity of entities) {
        entity.addComponent(new TopDownPlayerController(entity));
    }
    return entities;
}