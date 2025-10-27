import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { Camera } from 'engine/core/core.js';

export function setupResizeSystem(canvas, camera) {
    function resize({ displaySize: { width, height } }) {
        camera.getComponentOfType(Camera).aspect = width / height;
    }

    new ResizeSystem({ canvas, resize }).start();
}