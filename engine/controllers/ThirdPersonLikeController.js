import { vec3, quat } from 'glm';
import { Transform } from '../core/Transform.js';

export class ThirdPersonLikeController {

    constructor(entity, {


        velocity = [0, 0, 0],
        acceleration = 30,
        maxSpeed = 5,
        decay = 0.95,
        rotationSpeed = 3,
        gravity = -22,
        jumpStrength = 15,
        defaultGroundLevel = 0.3,
    } = {}) {
        this.entity = entity;

        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.rotationSpeed = rotationSpeed;
        this.decay = decay;

        this.verticalVelocity = 0;
        this.gravity = gravity;
        this.jumpStrength = jumpStrength;
        this.grounded = true;
        this.defaultGroundLevel = defaultGroundLevel;

        this.keys = {};
        this.initKeyboard();
    }

    initKeyboard() {
        this.keydownHandler = (e) => { this.keys[e.code] = true; };
        this.keyupHandler   = (e) => { this.keys[e.code] = false; };
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    update(t, dt) {
        const transform = this.entity.getComponentOfType(Transform);
        if (!transform) return;

        const forward = vec3.fromValues(0, 0, -1);
        const right   = vec3.fromValues(1, 0, 0);
        const rotation = transform.rotation;

        // Rotate the forward/right vectors into world space
        const worldForward = vec3.create();
        const worldRight = vec3.create();
        vec3.transformQuat(worldForward, forward, rotation);
        vec3.transformQuat(worldRight, right, rotation);

        const acc = vec3.create();
        if (this.keys['KeyS']) vec3.add(acc, acc, worldForward);
        if (this.keys['KeyW']) vec3.sub(acc, acc, worldForward);
        if (this.keys['KeyA']) vec3.add(acc, acc, worldRight);
        if (this.keys['KeyD']) vec3.sub(acc, acc, worldRight);

        // Accelerate in movement direction
        if (vec3.length(acc) > 0) {
            vec3.normalize(acc, acc);
            vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);
        } else {
            // Apply decay when no movement input
            vec3.scale(this.velocity, this.velocity, this.decay);
        }

        // Clamp horizontal speed
        const horizontalVel = vec3.clone(this.velocity);
        horizontalVel[1] = 0;
        const speed = vec3.length(horizontalVel);
        if (speed > this.maxSpeed) {
            vec3.scale(horizontalVel, horizontalVel, this.maxSpeed / speed);
            this.velocity[0] = horizontalVel[0];
            this.velocity[2] = horizontalVel[2];
        }

        if (transform.translation[1] <= this.defaultGroundLevel) {
            transform.translation[1] = this.defaultGroundLevel;
            this.verticalVelocity = 0;
            this.grounded = true;
        }

        if (!this.grounded) this.verticalVelocity += this.gravity * dt;

        if (this.keys['Space'] && this.grounded) {
            this.verticalVelocity = this.jumpStrength;
            this.grounded = false;
        }

        vec3.scaleAndAdd(transform.translation, transform.translation, this.velocity, dt);
        transform.translation[1] += this.verticalVelocity * dt;

        this.grounded = false;
    }

    handleCollisions(collisions) {

        // Reset grounded each frame
        this.grounded = false;
        this.groundInfo = null;

        for (const c of collisions) {
            // if the collision normal points upward more than sideways,
            // we can consider it a "floor" contact
            if (c.normal[1] > 0.5) {
                this.grounded = true;
                this.verticalVelocity = 0;

                // store info about what we’re standing on
                this.groundInfo = {
                    entity: c.entityB,
                    normal: c.normal,
                    penetration: c.penetration,
                };
            }
        }
    }
}
