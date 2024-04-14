/**
 * @typedef CollisionResult
 * @property {null | CollisionInfo} info
 */
/**
 * This interface define what every
 * collision detection algorithm should have.
 * @interface
 */
export function NarrowPhase(): void;
export class NarrowPhase {
    /**
     * @param {ConvexPolygon} a
     * @param {ConvexPolygon} b
     * @param {Body} objA
     * @param {Body} objB
     * @returns {CollisionResult}
     */
    isColliding(a: ConvexPolygon, b: ConvexPolygon, objA: Body, objB: Body): CollisionResult;
}
/**
 * @param {Body} objA
 * @param {Body} objB
 * @param {ConvexPolygon} shapeA
 * @param {ConvexPolygon} shapeB
 * @returns {Vector3[]}
 */
export function findContactPoints(objA: Body, objB: Body, shapeA: ConvexPolygon, shapeB: ConvexPolygon): Vector3[];
export type CollisionResult = {
    info: null | CollisionInfo;
};
import { ConvexPolygon } from "../../../Cubic.js";
import { Body } from "../../../Cubic.js";
import { Vector3 } from "../../../Cubic.js";
import { CollisionInfo } from "../../CollisionInfo.js";
