import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { UnlitRenderer } from 'engine/renderers/UnlitRenderer.js';

import { Camera, Entity, Transform } from 'engine/core/core.js';
import { quat } from 'glm';

const canvas = document.querySelector('canvas');
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

const loader = new GLTFLoader();
await loader.load(new URL('../../../models/cat/cat.gltf', import.meta.url));

const scene = loader.loadScene();
if (!scene) throw new Error('A default scene is required to run this example');

// Find camera in the scene
let camera = scene.find(entity => entity.getComponentOfType(Camera));

if (!camera) {
    console.warn('No camera found in GLTF, creating one manually...');
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

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height } }) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

// Optional: rotate camera around the origin
const t = camera.getComponentOfType(Transform);

let cat = scene[0];
if (!cat) throw new Error('Cat model not found');
const catTransform = cat.getComponentOfType(Transform);

const lerp = (start, end, t) => start + (end - start) * t;
const cameraTarget = [0, 0.3, 0.9];
let rotation_speed = 0.01;

new UpdateSystem({
    render: () => {
        // Rotate 90 degrees around Y axis
        const axis = [0, 1, 0]; // Y-axis
        const angle = Math.PI*rotation_speed; // 90 degrees in radians
        const rotationQuat = quat.setAxisAngle(quat.create(), axis, angle);

        const ease = 0.1; // 0 = no move, 1 = instant move
        t.translation[0] = lerp(t.translation[0], cameraTarget[0], ease);
        t.translation[1] = lerp(t.translation[1], cameraTarget[1], ease);
        t.translation[2] = lerp(t.translation[2], cameraTarget[2], ease);

        // Apply rotation
        quat.multiply(catTransform.rotation, rotationQuat, catTransform.rotation);
        renderer.render(scene, camera);
    }
}).start();

new ResizeSystem({ canvas, resize }).start();

document.addEventListener('keydown', function(event) {
    if (event.key === "Shift") cameraTarget[1] -= 0.1;
    if (event.key === " ") cameraTarget[1] += 0.1;
    if (event.key === "a") cameraTarget[0] -= 0.1;
    if (event.key === "d") cameraTarget[0] += 0.1;
    if (event.key === "s") cameraTarget[2] += 0.1;
    if (event.key === "w") cameraTarget[2] -= 0.1;
    if (event.key === "ArrowUp") rotation_speed += 0.01;
    if (event.key === "ArrowDown") rotation_speed -= 0.01;
    console.log(t.translation);
});
