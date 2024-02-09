/* eslint-disable */
import { Body } from "../../../Cubic.js";

/**
 * @typedef PotentialCollisionPair
 * @property {Body} a
 * @property {Body} b
 */
/**@abstract */
export default class BroadPhase {
	/**
     * Return a list of potential collision.
     * @param {Body[]} objects 
     * @returns {PotentialCollisionPair[]}
     */
	getPotentialCollision(objects) {
		throw new Error("Not implemented");
	}
}
