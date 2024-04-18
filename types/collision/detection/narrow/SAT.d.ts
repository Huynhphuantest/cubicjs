export namespace SAT {
    /**
     * @param {ConvexPolygon} a
     * @param {ConvexPolygon} b
     * @param {Body} objA
     * @param {Body} objB
     * @returns {CollisionResult}
     */
    function isColliding(a: ConvexPolygon, b: ConvexPolygon, objA: Body, objB: Body): import("./NarrowPhase.js").CollisionResult;
    /**
     * @typedef seperatingAxisResult
     * @property {number} penetration
     * @property {Vector3} axis
     */
    /**
     * @param {ConvexPolygon} shapeA
     * @param {Body} objA
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
     * @returns {null | seperatingAxisResult}
     */
    function separatingAxis(shapeA: ConvexPolygon, objA: Body, worldAVertices: Vector3[], worldBVertices: Vector3[]): {
        penetration: number;
        axis: Vector3;
    } | null;
    /**
     * @param {Projection} projectionA
     * @param {Projection} projectionB
     * @returns {number}
     */
    function calculatePenetrationDepth(projectionA: Projection, projectionB: Projection): number;
    /**
     * @param {Vector3[]} vertices
     * @param {Vector3} axis
     * @returns {Projection}
     */
    function project(vertices: Vector3[], axis: Vector3): Projection;
    /**
     * @param {ConvexPolygon} shapeA
     * @param {ConvexPolygon} shapeB
     * @param {Body} objA
     * @param {Body} objB
     * @returns {Vector3[]}
     */
    function findContactPoints(shapeA: ConvexPolygon, shapeB: ConvexPolygon, objA: Body, objB: Body): Vector3[];
    /**
     * @param {Vector3[]} worldVertices
     * @param {ConvexPolygon} shape
     * @param {Body} obj
     * @returns {Vector3[]}
     */
    function filterVerticesIntersectingShape(worldVertices: Vector3[], shape: ConvexPolygon, obj: Body): Vector3[];
    /**
     * @param {Vector3[]} vertices
     * @returns {Vector3}
     */
    function getCenter(vertices: Vector3[]): Vector3;
}
export type CollisionResult = import("./NarrowPhase.js").CollisionResult;
export type Projection = {
    min: number;
    max: number;
};
import { ConvexPolygon } from '../../../shape/ConvexPolygon.js';
import { Body } from '../../../Cubic.js';
import { Vector3 } from '../../../Cubic.js';
