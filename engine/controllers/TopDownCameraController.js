import { vec3, quat } from 'glm';
import { Transform } from '../core/Transform.js';

export class TopDownCameraController {

    constructor(cameraEntity, targetEntity, domElement, {
        height = 10,         // vertical distance above the player
        distance = 7,        // horizontal distance from the player
        smoothSpeed = 20,     // how quickly the camera moves
        angle = -Math.PI / 4, // tilt angle in radians
        pointerSensitivity = 0.0025
    } = {}) {
        this.camera = cameraEntity;
        this.target = targetEntity;
        this.element = domElement;

        this.height = height;
        this.distance = distance;
        this.smoothSpeed = smoothSpeed;
        this.angle = angle;
        this.pointerSensitivity = pointerSensitivity;

        this.yaw = 0; // horizontal rotation around the player

        this.currentPosition = vec3.create();
        this.desiredPosition = vec3.create();

        this.initMouse();
    }

    initMouse() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.element.addEventListener('click', () => this.element.requestPointerLock());
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === this.element) {
                document.addEventListener('pointermove', this.pointermoveHandler);
            } else {
                document.removeEventListener('pointermove', this.pointermoveHandler);
            }
        });
    }

    pointermoveHandler(e) {
        const dx = e.movementX;
        this.yaw -= dx * this.pointerSensitivity;
    }

    update(t, dt) {
        const cameraTransform = this.camera.getComponentOfType(Transform);
        const targetTransform = this.target.getComponentOfType(Transform);

        if (!cameraTransform || !targetTransform) return;

        // Calculate horizontal offset using yaw
        const offsetX = Math.sin(this.yaw) * this.distance;
        const offsetZ = Math.cos(this.yaw) * this.distance;

        // Desired position above the player
        this.desiredPosition[0] = targetTransform.translation[0] + offsetX;
        this.desiredPosition[1] = targetTransform.translation[1] + this.height;
        this.desiredPosition[2] = targetTransform.translation[2] + offsetZ;

        // Smoothly interpolate camera position
        vec3.lerp(this.currentPosition, cameraTransform.translation, this.desiredPosition, dt * this.smoothSpeed);
        cameraTransform.translation = vec3.clone(this.currentPosition);

        // Set rotation to look at the player
        const direction = vec3.create();
        vec3.sub(direction, targetTransform.translation, cameraTransform.translation);
        vec3.normalize(direction, direction);

        const rotation = quat.create();

        // Tilt down by angle around X-axis
        const yawQuat = quat.create();
        quat.rotateY(yawQuat, yawQuat, this.yaw);
        quat.rotateX(rotation, yawQuat, this.angle);

        cameraTransform.rotation = rotation;
    }
}
