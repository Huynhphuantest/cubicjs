export class Body {
    /**
     * This represents a RigidBody.
     * @constructor
     * @param {object} params
     * @param {Shape[] | Shape} [params.shapes]
     * @param {number} [params.mass]
     * @param {Material} [params.material]
     */
    constructor({ shapes, mass, material, }: {
        shapes?: Shape | Shape[] | undefined;
        mass?: number | undefined;
        material?: Material | undefined;
    });
    shapes: Shape[];
    type: number;
    name: string;
    material: Material;
    position: Vector3;
    velocity: Vector3;
    quaternion: Quaternion;
    angularVelocity: Vector3;
    mass: number;
    /**@type number */
    invMass: number;
    inertia: Vector3;
    invInertia: Vector3;
    /**@type {number} */
    inertiaScalar: number;
    /**@type {number} */
    invInertiaScalar: number;
    /**@description Local */
    AABB: AABB;
    /**@type {null | Body} */
    parrent: null | Body;
    /**@description World infomation of this body, this should not be changed manually*/
    worldInfo: {
        AABB: AABB;
    };
    /**@description Previous info of this body, this should not be changed manually */
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
}
import { Shape } from "./Shape.js";
import { Material } from "../Cubic.js";
import { Vector3 } from "../Cubic.js";
import { Quaternion } from "../Cubic.js";
import { AABB } from "../collision/AABB.js";
import { World } from "../Cubic.js";
