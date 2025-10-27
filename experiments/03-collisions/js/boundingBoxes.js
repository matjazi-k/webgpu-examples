// boundingBoxes.js
import { Model } from 'engine/core/core.js';
import { calculateAxisAlignedBoundingBox, mergeAxisAlignedBoundingBoxes } from 'engine/core/MeshUtils.js';

/**
 * Calculates and assigns axis-aligned bounding boxes (AABBs)
 * to all entities in the scene that have a Model component.
 */
export function setupBoundingBoxes(scene) {
    for (const entity of scene) {
        const model = entity.getComponentOfType(Model);
        if (!model) continue;

        const boxes = model.primitives.map(primitive =>
            calculateAxisAlignedBoundingBox(primitive.mesh)
        );

        const validBoxes = boxes.filter(b => b !== undefined && b.min && b.max);
        if (validBoxes.length === 0) return;
        entity.aabb = mergeAxisAlignedBoundingBoxes(validBoxes);
    }
}