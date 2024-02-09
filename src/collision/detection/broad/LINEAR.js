// O(n^2) complexity, should not be used at all
// extremely unefficient, extremely expensive
// extremely slow, only use if other algorithm is not available
// potential duplicate pairs
// this is just an example of a broad phase algorithm

// eslint-disable-next-line no-unused-vars
import { Body } from "../../../Cubic.js";
import BroadPhase from "./BroadPhase.js";

/**
 * @typedef {import('./BroadPhase.js').PotentialCollisionPair} PotentialCollisionPair
 */
class LINEARAlgorithm extends BroadPhase {
	/**
     * @override
     * @param {Body[]} objects
     * @returns {PotentialCollisionPair[]}
     */
	getPotentialCollision(objects) {
		/**@type {PotentialCollisionPair[]} */
		const pairs = [];
		for(const obj of objects) {
			for(const potential of objects) {
				if(potential === obj) continue;
				pairs.push({
					a: obj,
					b: potential
				});
			}
		}
		return pairs;
	}
}

const LINEAR = new LINEARAlgorithm();
export default LINEAR;
