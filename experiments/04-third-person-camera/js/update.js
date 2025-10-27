import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

const lerp = (start, end, t) => start + (end - start) * t;

export function setupUpdateSystem(renderer, scene, camera) {
    function update(time, dt) {
        // Update all components
        for (const entity of scene) {
            for (const component of entity.components) {
                component.update?.(time, dt);
            }
        }
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