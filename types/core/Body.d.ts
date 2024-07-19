export class Body extends EventDispatcher {
    /**
     * This represents a RigidBody.
     * @constructor
     * @param {object} params
     * @param {Shape} params.shape
     * @param {number} [params.mass]
     * @param {Material} [params.material]
     */
    constructor({ shape, mass, material }: {
        shape: Shape;
        mass?: number | undefined;
        material?: Material | undefined;
    });
    shape: Shape;
    type: number;
    name: string;
    material: Material;
    position: Vector3;
    velocity: Vector3;
    quaternion: Quaternion;
    angularVelocity: Vector3;
    mass: number;
    /** @type number */
    invMass: number;
    inertia: Vector3;
    invInertia: Vector3;
    /** @type {number} */
    inertiaScalar: number;
    /** @type {number} */
    invInertiaScalar: number;
    /** @description Local */
    AABB: AABB;
    /** @type {null | Body} */
    parrent: null | Body;
    /** @description World infomation of this body, this should not be changed manually */
    worldInfo: {
        AABB: AABB;
    };
    /** @description Previous info of this body, this should not be changed manually */
    previousInfo: {
        position: Vector3;
        quaternion: Quaternion;
        mass: number;
    };
    /**
     * @param {World} world
     * @param {number} deltaTime
     */
    update(world: World, deltaTime: number): void;
    updateWorldPositionAABB(): void;
    updateWorldRotationAABB(): void;
    updateAABB(): void;
    updateMass(): void;
    /**
     * @param {number | Vector3} x
     * @param {number} y
     * @param {number} z
     */
    translate(x: number | Vector3, y: number, z: number): void;
    /**
     * @param {number | Vector3} x
     * @param {number} y
     * @param {number} z
     */
    rotate(x: number | Vector3, y: number, z: number): void;
    /**
     * @param {Vector3} impulse
     * @param {Vector3} relative
     */
    applyImpulse(impulse: Vector3, relative: Vector3): void;
}
import { EventDispatcher } from './EventDispatcher.js';
import { Shape } from './Shape.js';
import { Material } from '../Cubic.js';
import { Vector3 } from '../Cubic.js';
import { Quaternion } from '../Cubic.js';
import { AABB } from '../collision/AABB.js';
import { World } from '../Cubic.js';
