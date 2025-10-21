import { UpdateSystem } from 'engine/systems/UpdateSystem.js';
import { Camera, Transform } from 'engine/core/core.js';
import { quat } from 'glm';

export function setupUpdateSystem(renderer, scene, camera, cat, cameraTarget, getRotationSpeed) {
    const cameraTransform = camera.getComponentOfType(Transform);
    const catTransform = cat.transform;

    const lerp = (start, end, t) => start + (end - start) * t;

    var time = 0;
    const baseY = 0; // starting height
    const amplitude = 0.1;
    const frequency = 5;

    new UpdateSystem({
        render: () => {
            const axis = [0, 1, 0];
            const angle = Math.PI * getRotationSpeed();
            const rotationQuat = quat.setAxisAngle(quat.create(), axis, angle);

            const ease = 0.1;
            cameraTransform.translation[0] = lerp(cameraTransform.translation[0], cameraTarget[0], ease);
            cameraTransform.translation[1] = lerp(cameraTransform.translation[1], cameraTarget[1], ease);
            cameraTransform.translation[2] = lerp(cameraTransform.translation[2], cameraTarget[2], ease);

            quat.multiply(catTransform.rotation, rotationQuat, catTransform.rotation);

            time += 0.016;
            catTransform.translation[1] = baseY + amplitude * Math.abs(Math.sin(frequency * time));

            renderer.render(scene, camera);
        }
    }).start();
}