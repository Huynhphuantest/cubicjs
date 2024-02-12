// eslint-disable-next-line no-unused-vars
import { Body } from "../../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import AABB from "../../AABB.js";
import BroadPhase from "./BroadPhase.js";


/**
 * @typedef Checkable
 * @property {AABB} AABB
 */
/**
 * @typedef {import('./BroadPhase.js').PotentialCollisionPair} PotentialCollisionPair
 */

class SAPAlgorithm extends BroadPhase {
	/**
     * @param {Body[]} objects
     * @returns {PotentialCollisionPair[]}
     */
	getPotentialCollision(objects) {
		/**@type {Body[]} */
		const axisList = objects.sort((a, b) => {
			if(a.worldInfo.AABB.lowerBound.x < b.worldInfo.AABB.lowerBound.x) {
				return -1;
			}
			if(a.worldInfo.AABB.lowerBound.x > b.worldInfo.AABB.lowerBound.x) {
				return 1;
			}
			return 0;
		});
		const pairs = [];
	
		// loop through all objects:
		for(let i = 0; i < axisList.length; i++) {
			// For each object, iterate over all the subsequent objects in the list
			// and find out if there are overlaps on the x-axis:
			for(let j = i+1; j < axisList.length; j++) {
				const a = axisList[i];
				const b = axisList[j];
				if(a.worldInfo.AABB.upperBound.x < b.worldInfo.AABB.lowerBound.x) {
					break;
				}
				// if there is an overlap, add A to B's list 
				// and B to A's list of potential collisions.
				// [every object's list of collision candidates is 
				// cleared before the next frame]

				//if(!a.worldInfo.AABB.overlaps(b.worldInfo.AABB)) break;
				pairs.push({
					a,
					b
				});
			}
		}
		return pairs;
	}
}

const SAP = new SAPAlgorithm();
export default SAP;