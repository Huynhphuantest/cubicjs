// eslint-disable-next-line no-unused-vars
import { Body, Vector3 } from '../../Cubic.js';
// eslint-disable-next-line no-unused-vars
import { CollisionInfo } from '../CollisionInfo.js';

export const Impulse = {
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
	resolve (objA, objB, info) {
		this.penetrationResolution(objA, objB, info);
		this.applyImpulse(objA, objB, info);
	},
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
	penetrationResolution (objA, objB, info) {
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
	applyImpulse (objA, objB, info) {
		/**
		 * @typedef Constraint
		 * @property {number} impulse
		 * @property {Vector3} normal
		 * @property {Vector3} ra
		 * @property {Vector3} rb
		 */
		/** @type {Constraint[]} */
		const constraints = [];
		for (const contact of info.points) {
			const N = info.normal;
			const ra = contact.subed(objA.position);
			const rb = contact.subed(objB.position);

			const e = objA.material.restitution * objB.material.restitution;

			const Va = objA.velocity.added(
				objA.angularVelocity.crossed(ra)
			);
			const Vb = objB.velocity.added(
				objB.angularVelocity.crossed(rb)
			);

			const Vr = Va.subed(Vb);
			
			const contactMag = Vr.dot(N);

			const Vj = contactMag * (-(1 + e));

			const thetaA = ra.
				crossed(N).
				crossed(ra).
				mulScalar(objA.invInertiaScalar);
			const thetaB = rb.
				crossed(N).
				crossed(rb).
				mulScalar(objB.invInertiaScalar);

			const denom =
				(objA.invMass + objB.invMass) +
				(thetaA.add(thetaB).dot(N));
			const j = Vj / denom;

			constraints.push({
				impulse: j / info.points.length,
				normal: N,
				ra,
				rb
			});
		}

		for (const constraint of constraints) {
			const impulse = constraint.normal.muled(constraint.impulse);
			objA.applyImpulse(impulse, constraint.ra);
			objB.applyImpulse(impulse.negated(), constraint.rb);
		}
	}
};
