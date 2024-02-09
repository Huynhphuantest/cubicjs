// eslint-disable-next-line no-unused-vars
import { Body } from "../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import Shape from "../../core/Shape.js";
// eslint-disable-next-line no-unused-vars
import ConvexPolygon from "../../shape/ConvexPolygon.js";
// eslint-disable-next-line no-unused-vars
import { Sphere } from "../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import { CollisionInfo } from "../detection/CollisionDetectionAlgorithm.js";

class ImpulseResponse {
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info 
     */
	resolve(objA, objB, info) {
		// Collision
		// Elasticity
		const e = 0.5;
		// Relative velocity
		const Vr = objA.velocity.clone().sub(objB.velocity);
		// Collision normal
		const N = info.normal;
		// Total velocity of collision (j is the impulse)
		const Vj = Vr.dot(N) * (-(1 + e));
		// Total force of collision
		const j = Vj / (objA.invMass + objB.invMass);

		// Apply impulse
		if(objA.mass !== 0)
			objA.velocity.add(
				N.clone().mulScalar(objA.invMass*j)
			);
		if(objB.mass !== 0)
			objB.velocity.sub(
				N.clone().mulScalar(objB.invMass*j)
			);
	}
}

const Impulse = new ImpulseResponse();
export default Impulse;