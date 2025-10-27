import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

/**
 * Sets up and starts the update/render loop for the scene.
 *
 * @param {Object} params
 * @param {any[]} params.scene - The list of entities in the scene.
 * @param {Object} params.physics - The physics system instance.
 * @param {Object} params.renderer - The renderer instance.
 * @param {Object} params.camera - The active camera.
 */
export function setupUpdateSystem({ scene, physics, renderer, camera }) {
    // Called every frame
    function update(time, dt) {
        // Update all components
        for (const entity of scene) {
            for (const component of entity.components) {
                component.update?.(time, dt);
            }
        }

        // Update physics
        physics.update(time, dt);
    }

    // Called after update() each frame
    function render() {
        renderer.render(scene, camera);
    }

    // Create and start the update loop
    const system = new UpdateSystem({ update, render });
    system.start();

    return system;
}
