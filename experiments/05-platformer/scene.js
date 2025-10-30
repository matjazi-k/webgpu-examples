import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Camera, Entity, Transform, Parent } from 'engine/core/core.js';
//import { FirstPersonControllerLimitedRotation } from 'engine/controllers/FirstPersonControllerLimitedRotation.js';
import { TopDownCameraController } from 'engine/controllers/TopDownCameraController.js';
import { ThirdPersonLikeController } from 'engine/controllers/ThirdPersonLikeController.js';

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

    const newEntities = loader.loadScene();
    if (!newEntities.length) throw new Error('No entities found in model');

    const rootEntity = scene[0];

    const parentEntity = new Entity();
    parentEntity.addComponent(new Parent(rootEntity));

    const parentTransform = new Transform();
    parentEntity.addComponent(parentTransform);

    if (options.translation) parentTransform.translation = options.translation;
    if (options.rotation) parentTransform.rotation = options.rotation;
    if (options.scale) parentTransform.scale = options.scale;

    for (const entity of newEntities) {
        entity.addComponent(new Parent(parentEntity));
        scene.push(entity);
    }

    scene.push(parentEntity);

    return parentEntity;
}

export async function addController(entity, canvas) {
    entity.addComponent(new ThirdPersonLikeController(entity));
    return entity;
}