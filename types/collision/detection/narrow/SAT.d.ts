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
     * @param {Vector3[]} axes
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
     * @returns {null | seperatingAxisResult}
     */
    function separatingAxis(axes: Vector3[], worldAVertices: Vector3[], worldBVertices: Vector3[]): {
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
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
     * @param {Vector3[]} axesA
     * @param {Vector3[]} axesB
     * @returns {Vector3[]}
     */
    function findContactPoints(worldAVertices: Vector3[], worldBVertices: Vector3[], axesA: Vector3[], axesB: Vector3[]): Vector3[];
    /**
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
     * @param {Vector3[]} axes
     * @returns {Vector3[]}
     */
    function filterVerticesIntersectingShape(worldAVertices: Vector3[], worldBVertices: Vector3[], axes: Vector3[]): Vector3[];
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
