import { vec3, quat, mat4 } from 'glm';
import { Transform } from '../core/Transform.js';

export class ThirdPersonCameraController {
    constructor(cameraEntity, targetEntity, domElement, {
        distance = 5,
        height = 2,
        smooth = 0.1,
        pointerSensitivity = 0.002,
        minPitch = -Math.PI / 2 + 0.1,
        maxPitch = Math.PI / 2 - 0.1,

    } = {}) {
        this.camera = cameraEntity;
        this.target = targetEntity;
        this.distance = distance;
        this.domElement = domElement;

        this.distance = distance;
        this.height = height;
        this.smooth = smooth;
        this.pointerSensitivity = pointerSensitivity;
        this.minPitch = minPitch;
        this.maxPitch = maxPitch;

        this.currentPos = vec3.create();
        this.pitch = 0;
        this.yaw = 0;

        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        element.addEventListener('click', () => element.requestPointerLock());
        doc.addEventListener('pointerlockchange', () => {
            if (doc.pointerLockElement === element) {
                doc.addEventListener('pointermove', this.pointermoveHandler);
            } else {
                doc.removeEventListener('pointermove', this.pointermoveHandler);
            }
        });
    }

    pointermoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;

        this.yaw   -= dx * this.pointerSensitivity;
        this.pitch -= dy * this.pointerSensitivity;

        this.pitch = Math.min(Math.max(this.pitch, this.minPitch), this.maxPitch);

        const twopi = Math.PI * 2;
        this.yaw = ((this.yaw % twopi) + twopi) % twopi;
    }

    update(t, dt) {
        const camTransform = this.camera.getComponentOfType(Transform);
        const targetTransform = this.target.getComponentOfType(Transform);
        if (!camTransform || !targetTransform) return;

        const targetPos = vec3.clone(targetTransform.translation);

        // Keep the camera at fixed height
        const y = this.height;

        // Horizontal orbit around the target
        const x = this.distance * Math.sin(this.yaw);
        const z = this.distance * Math.cos(this.yaw);

        const offset = [
            this.distance * Math.cos(this.pitch) * Math.sin(this.yaw),
            this.distance * Math.sin(this.pitch),
            this.distance * Math.cos(this.pitch) * Math.cos(this.yaw)
        ];

        const desiredPos = vec3.add(vec3.create(), targetPos, offset);

        if (vec3.length(this.currentPos) === 0) vec3.copy(this.currentPos, desiredPos);

        // Smooth follow
        vec3.lerp(this.currentPos, this.currentPos, desiredPos, 1 - Math.pow(this.smooth, dt));

        camTransform.translation = this.currentPos;

        // Look at the target with optional vertical offset
        const lookAtTarget = targetPos;

        this.lookAt(camTransform, lookAtTarget);
    }

    lookAt(transform, target) {
        const forward = vec3.sub(vec3.create(), target, transform.translation);
        vec3.normalize(forward, forward);

        const up = [0, 1, 0];
        const right = vec3.cross(vec3.create(), up, forward);
        vec3.normalize(right, right);

        const trueUp = vec3.cross(vec3.create(), forward, right);

        // Column-major matrix for GLM quat
        const rot3 = [
            right[0], trueUp[0], -forward[0],
            right[1], trueUp[1], -forward[1],
            right[2], trueUp[2], -forward[2],
        ];

        quat.fromMat3(transform.rotation, rot3);
        quat.normalize(transform.rotation, transform.rotation);
    }
}
