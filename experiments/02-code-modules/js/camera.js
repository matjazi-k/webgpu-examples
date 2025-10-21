import { Camera, Entity, Transform } from 'engine/core/core.js';

export function setupCamera(scene, canvas) {
    let camera = scene.find(entity => entity.getComponentOfType(Camera));

    if (!camera) {
        console.warn('No camera found, creating one manually...');
        camera = new Entity();
        const transform = new Transform();
        camera.addComponent(transform);

        const cam = new Camera();
        cam.aspect = canvas.width / canvas.height;
        cam.fov = 60 * Math.PI / 180;
        cam.near = 0.1;
        cam.far = 100;
        camera.addComponent(cam);
    }

    return camera;
}