// eslint-disable-next-line no-unused-vars
import { Body, Vector3, Shape, ConvexPolygon } from "../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import { Sphere } from "../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import { CollisionInfo } from "../CollisionInfo.js";

export const Impulse = {
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info 
     */
	resolve(objA, objB, info) {
		this.penetrationResolution(objA, objB, info);
		//this.applyImpulse(objA, objB, info);
	},
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info 
     */
	penetrationResolution(objA, objB, info) {
		const penetrationVector = info.normal.muledScalar(info.penetration);
		const totalMass = objA.mass + objB.mass;
		objA.position.add(
			penetrationVector.muledScalar(-objA.mass / totalMass)
		);
		objB.position.add(
			penetrationVector.muledScalar(objB.mass / totalMass)
		);
	},
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info 
     */
	applyImpulse(objA, objB, info) {
		/**
		 * @typedef Contact
		 * @property {number} impulse
		 * @property {Vector3} normal
		 * @property {Vector3} ra
		 * @property {Vector3} rb
		 */
		/**@type {Contact[]} */
		const contacts = [];
		for(const contact of info.points) {
			const N = info.normal;

			const
				ra = contact.subed(objA.position),
				rb = contact.subed(objB.position);
			const unitVec = new Vector3(0,0,1);
			const raPerp = ra.crossed(unitVec);
			const rbPerp = rb.crossed(unitVec);
			if(raPerp.lengthSq() === 0) raPerp.set(0,0,1);
			if(rbPerp.lengthSq() === 0) rbPerp.set(0,0,1);

			const e = objA.material.restitution * objB.material.restitution;

			const Vr = 
				objA.velocity.added(raPerp.muled(objA.angularVelocity))
				.sub(
					objB.velocity.added(rbPerp.muled(objB.angularVelocity))
				);
			
			const contactMag = Vr.dot(N);
			//Collision already resolved
				//if(contactMag >= 0) continue;	
			// Total velocity of collision (j is the impulse)
			const Vj = contactMag * (-(1 + e));

			const raPerpDotN = raPerp.dot(N);
			const rbPerpDotN = rbPerp.dot(N);

			const denom = 
				(objA.invMass + objB.invMass) +
				(raPerpDotN * raPerpDotN) * objA.invInertiaScalar +
				(rbPerpDotN * rbPerpDotN) * objB.invInertiaScalar;
			const j = Vj / denom;
			contacts.push({
				impulse: j / info.points.length,
				normal: N,
				ra,
				rb
			});
		}
		
		for(const contact of contacts) {
			if(objA.mass !== 0) {
				objA.velocity.add(
					contact.normal.muledScalar(
						objA.invMass*contact.impulse
					)
				);		
				objA.angularVelocity.add(
					contact.ra.crossed(contact.normal.muledScalar(contact.impulse)).mulScalar(
						objA.invInertiaScalar
					)
				);
			}

			if(objB.mass !== 0) {
				objB.velocity.sub(
					contact.normal.muledScalar(
						objB.invMass*contact.impulse
					)
				);
				objB.angularVelocity.sub(
					contact.rb.crossed(contact.normal.muledScalar(contact.impulse)).mulScalar(
						objB.invInertiaScalar
					)
				);
			}
		}

	}
};