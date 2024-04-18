/**
 * @typedef {import('../collision/detection/narrow/NarrowPhase.js').CollisionResult} CollisionResult
 */
export class World {
    /**
     * @constructor
     * @param {object} config
     * @param {Vector3} [config.gravity] - This define the velocity added each step to all objects in world
     */
    constructor({ gravity }: {
        gravity?: Vector3 | undefined;
    });
    /** @constant */
    gravity: Vector3;
    /**
     * @type {Body[]}
     * @constant
     */
    bodys: Body[];
    /**
     * @param {number} deltaTime
     */
    step(deltaTime: number): void;
    /**
     * @param {Body} body
     */
    add(body: Body): void;
}
export type CollisionResult = import('../collision/detection/narrow/NarrowPhase.js').CollisionResult;
import { Vector3 } from '../Cubic.js';
import { Body } from './Body.js';
