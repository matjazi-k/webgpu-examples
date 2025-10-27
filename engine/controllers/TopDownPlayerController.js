import { vec3, quat } from 'glm';
import { Transform } from '../core/Transform.js';

export class TopDownPlayerController {

    constructor(playerEntity, {
        moveSpeed = 3,
        rotationSpeed = 5,
        jumpSpeed = 10,     // upward velocity for jump
        gravity = -20     // gravity acceleration
    } = {}) {
        this.player = playerEntity;
        this.moveSpeed = moveSpeed;
        this.rotationSpeed = rotationSpeed;
        this.jumpSpeed = jumpSpeed;
        this.gravity = gravity;

        this.verticalVelocity = 0;
        this.isGrounded = true;

        this.keys = {};
        this.initKeyboard();
    }

    initKeyboard() {
        this.keydownHandler = (e) => { this.keys[e.code] = true; };
        this.keyupHandler   = (e) => { this.keys[e.code] = false; };

        const doc = document;
        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);
    }

    update(t, dt) {
        const playerTransform = this.player.getComponentOfType(Transform);
        if (!playerTransform) return;

        // --- Existing movement code ---
        const forward = vec3.fromValues(0, 0, -1);
        const rotation = playerTransform.rotation;
        const worldForward = vec3.create();
        vec3.transformQuat(worldForward, forward, rotation);

        const moveDir = vec3.create();
        if (this.keys['KeyS']) vec3.add(moveDir, moveDir, worldForward);
        if (this.keys['KeyW']) vec3.sub(moveDir, moveDir, worldForward);

        if (vec3.length(moveDir) > 0) {
            vec3.normalize(moveDir, moveDir);
            vec3.scale(moveDir, moveDir, this.moveSpeed * dt);
            vec3.add(playerTransform.translation, playerTransform.translation, moveDir);
        }

        if (this.keys['KeyA']) quat.rotateY(playerTransform.rotation, playerTransform.rotation, this.rotationSpeed * dt);
        if (this.keys['KeyD']) quat.rotateY(playerTransform.rotation, playerTransform.rotation, -this.rotationSpeed * dt);

        // --- Jumping mechanic ---
        if (this.keys['Space'] && this.isGrounded) {
            this.verticalVelocity = this.jumpSpeed;
            this.isGrounded = false;
        }

        // Apply gravity
        this.verticalVelocity += this.gravity * dt;
        playerTransform.translation[1] += this.verticalVelocity * dt;

        // Simple ground collision
        if (playerTransform.translation[1] <= 0) {
            playerTransform.translation[1] = 0;
            this.verticalVelocity = 0;
            this.isGrounded = true;
        }
    }
}
