export namespace GJK {
    let MAX_INTERATIONS: number;
    /**
     *
     * @param {ConvexPolygon} shapeA
     * @param {ConvexPolygon} shapeB
     * @param {Vector3} direction
     * @param {Body} objA
     * @param {Body} objB
     * @returns {Vector3}
     */
    function support(shapeA: ConvexPolygon, shapeB: ConvexPolygon, objA: Body, objB: Body, direction: Vector3): Vector3;
    /**
     * @param {ConvexPolygon} shapeA
     * @param {ConvexPolygon} shapeB
     * @param {Body} objA
     * @param {Body} objB
     * @returns {CollisionResult}
     */
    function isColliding(shapeA: ConvexPolygon, shapeB: ConvexPolygon, objA: Body, objB: Body): import("./NarrowPhase.js").CollisionResult;
    /**
     * @param {Vector3[]} simplex
     * @param {Vector3} direction
     * @returns
     */
    function handleSimplex(simplex: Vector3[], direction: Vector3): boolean;
}
export type CollisionResult = import("./NarrowPhase.js").CollisionResult;
export type polytopeFace = {
    a: Vector3;
    b: Vector3;
    point: Vector3;
};
import { ConvexPolygon } from '../../../shape/ConvexPolygon.js';
import { Body } from '../../../Cubic.js';
import { Vector3 } from '../../../Cubic.js';
