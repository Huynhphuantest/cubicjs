/* eslint no-unused-vars: 0 */

import { Vector3, Body, ConvexPolygon } from "../../../Cubic.js";
import { CollisionInfo } from "../../CollisionInfo.js";

/**
 * @typedef CollisionResult
 * @property {null | CollisionInfo} info
 */

/**
 * This interface define what every 
 * collision detection algorithm should have.
 * @interface
 */
export function NarrowPhase() {}
/**
 * @param {ConvexPolygon} a
 * @param {ConvexPolygon} b
 * @param {Body} objA
 * @param {Body} objB
 * @returns {CollisionResult}
 */
NarrowPhase.prototype.isColliding = function(a, b, objA, objB) {
	throw Error("Not implemented");
};
/**
 * @param {Body} objA
 * @param {Body} objB
 * @param {ConvexPolygon} shapeA
 * @param {ConvexPolygon} shapeB
 * @returns {Vector3[]}
 */
export function findContactPoints(objA, objB, shapeA, shapeB) {
	return [new Vector3(0,0,0)];
}