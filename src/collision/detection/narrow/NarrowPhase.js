/* eslint no-unused-vars: 0 */

import { Vector3, Body, ConvexPolygon } from "../../../Cubic.js";
import CollisionInfo from "../../CollisionInfo.js";

/**
 * @typedef CollisionResult
 * @property {null | CollisionInfo} info
 */

/**
 * This interface define what every 
 * collision detection algorithm should have.
 * @interface
 */
export default function CollisionDetectionAlgorithm() {}
/**
 * @param {ConvexPolygon} a
 * @param {ConvexPolygon} b
 * @param {Body} objA
 * @param {Body} objB
 * @returns {CollisionResult}
 */
CollisionDetectionAlgorithm.prototype.isColliding = function(a, b, objA, objB) {
	throw Error("Not implemented");
};