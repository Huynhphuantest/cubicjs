export type ShapeType = number;
export namespace ShapeType {
    let Box: number;
    let Sphere: number;
    let Plane: number;
    let Cylinder: number;
    let ConvexPolygon: number;
    let Trimesh: number;
}
export class Shape {
    /**
     * @param {object} params
     * @param {ShapeType} params.type
     */
    constructor({ type }: {
        type: ShapeType;
    });
    type: number;
    parameters: {};
    AABB: AABB;
    /** @abstract */
    updateBoundingSphereRadius(): void;
    /** @abstract */
    updateAABB(): void;
    /**
     * @param {number} mass
     * @returns {Vector3}
     * @abstract
     */
    calculateInertia(mass: number): Vector3;
}
import { AABB } from '../collision/AABB.js';
import { Vector3 } from '../Cubic.js';
