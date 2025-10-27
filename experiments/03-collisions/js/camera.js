import { ThirdPersonCameraController } from '/engine/controllers/ThirdPersonCameraController.js';

/**
 * Sets up a third-person camera that follows the player.
 *
 * @param {Object} camera - The camera entity.
 * @param {Object} player - The player entity.
 * @param {Object} [options]
 * @param {number} [options.distance=-5] - How far behind the player.
 * @param {number} [options.height=2] - How high above the player.
 * @param {number} [options.smooth=0.1] - How smooth the camera follows.
 */
export async function setupCamera(camera, player, canvas, options = {}) {
    const controller = new ThirdPersonCameraController(camera, player, canvas, {
        distance: options.distance ?? 5,
        height: options.height ?? 2,
        smooth: options.smooth ?? 0.1,
    });

    camera.addComponent(controller);
    return controller;
}