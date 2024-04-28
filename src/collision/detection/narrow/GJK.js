// eslint-disable-next-line no-unused-vars
import { Vector3, Face } from '../../../Cubic.js';
// eslint-disable-next-line no-unused-vars
import { ConvexPolygon } from '../../../shape/ConvexPolygon.js';
// eslint-disable-next-line no-unused-vars
import { NarrowPhase } from './NarrowPhase.js';
// eslint-disable-next-line no-unused-vars
import { CollisionInfo } from '../../CollisionInfo.js';
// eslint-disable-next-line no-unused-vars
import { Body } from '../../../Cubic.js';

/**
 * @typedef {import("./NarrowPhase.js").CollisionResult} CollisionResult
 */

/**
 * @typedef polytopeFace
 * @property {Vector3} a
 * @property {Vector3} b
 * @property {Vector3} point
 */
const EPA = {
	/**
	 * @param {Vector3[]} simplex
	 * @param {ConvexPolygon} shapeA
	 * @param {ConvexPolygon} shapeB
     * @param {Body} objA
	 * @param {Body} objB
	 * @returns {CollisionInfo}
	 */
	getInfo (simplex, shapeA, shapeB, objA, objB) {
		const polytope = simplex.map(point => {
			const supportA = shapeA
				.getFurthestVertexInDirection(point)
				.applyQuaternion(objA.quaternion)
				.add(objA.position);
			const supportB = shapeB
				.getFurthestVertexInDirection(point.negated())
				.applyQuaternion(objB.quaternion)
				.add(objB.position);
			return {
				a: supportA,
				b: supportB,
				point: supportA.subed(supportB)
			};
		});

		while (true) {
			const closestFace = this.findClosestFace(polytope);
			const support = shapeA
				.getFurthestVertexInDirection(closestFace.normal)
				.applyQuaternion(objA.quaternion)
				.add(objA.position);

			const distance = closestFace.normal.dot(support) - closestFace.distance;

			const contactPoints = this.extractContactPoints(polytope);
			if (distance < 0.001) {
				return {
					penetration: -distance,
					normal: closestFace.normal,
					points: contactPoints
				};
			}

			polytope.push({
				a: support,
				b: shapeB
					.getFurthestVertexInDirection(closestFace.normal.negate())
					.applyQuaternion(objB.quaternion)
					.add(objB.position),
				point: support.subed(
					shapeB
						.getFurthestVertexInDirection(closestFace.normal)
						.applyQuaternion(objB.quaternion)
						.add(objB.position)
				)
			});
		}
	},
	/**
	 * @param {polytopeFace[]} polytope
	 * @returns {Vector3[]}
	 */
	extractContactPoints (polytope) {
		const contactPoints = [];

		// Iterate over the faces or points in the polytope
		for (const face of polytope) {
			// Extract multiple contact points based on the geometry of the face
			// For simplicity, consider the midpoint of the edge (a, b) as a contact point
			const contactPoint = face.a.clone().lerp(face.b, 0.5);
			contactPoints.push(contactPoint);
		}

		return contactPoints;
	},
	/**
	 * @param {polytopeFace[]} polytope
	 * @returns {*}
	 */
	findClosestFace (polytope) {
		const faces = polytope.map(face => {
			const normal = face.point.normalized();
			const distance = normal.dot(face.a);
			return { normal, distance };
		});

		return faces.reduce((prev, curr) => (curr.distance > prev.distance ? curr : prev), faces[0]);
	}
};

export const GJK = {
	MAX_INTERATIONS: 31,
	/**
	 *
	 * @param {ConvexPolygon} shapeA
	 * @param {ConvexPolygon} shapeB
	 * @param {Vector3} direction
	 * @param {Body} objA
	 * @param {Body} objB
	 * @returns {Vector3}
	 */
	support (shapeA, shapeB, objA, objB, direction) {
		const pointA = shapeA
			.getFurthestVertexInDirection(direction)
			.applyQuaternion(objA.quaternion)
			.add(objA.position);
		const pointB = shapeB
			.getFurthestVertexInDirection(direction.negated())
			.applyQuaternion(objB.quaternion)
			.add(objB.position);
		return pointA.subed(pointB);
	},

	/**
	 * @param {ConvexPolygon} shapeA
	 * @param {ConvexPolygon} shapeB
	 * @param {Body} objA
	 * @param {Body} objB
	 * @returns {CollisionResult}
	 */
	isColliding (shapeA, shapeB, objA, objB) {
		const direction = new Vector3(1, 0, 0); // Initial search direction
		const support = this.support(shapeA, shapeB, objA, objB, direction);
		const simplex = [support];

		direction.negate(); // Reverse direction for the next iteration

		let i = 0;
		while (i < this.MAX_INTERATIONS) {
			support.copy(this.support(shapeA, shapeB, objA, objB, direction));

			if (support.dot(direction) < 0) {
				// No intersection
				return {
					info: null
				};
			}

			simplex.push(support);

			if (this.handleSimplex(simplex, direction)) {
				// Intersection found
				return {
					info: EPA.getInfo(simplex, shapeA, shapeB, objA, objB)
				};
			}
			i++;
		}

		return {
			info: null
		};
	},

	/**
	 * @param {Vector3[]} simplex
	 * @param {Vector3} direction
	 * @returns
	 */
	handleSimplex (simplex, direction) {
		const a = simplex[simplex.length - 1];
		const ao = a.negated();

		if (simplex.length === 2) {
			const b = simplex[0];
			const ab = b.subed(a);

			// Check if the origin is in the region of line AB
			const abPerp = ab.crossed(ao).cross(ab);
			if (abPerp.dot(a) > 0) {
				// Set direction to perpendicular to AB in the direction of the origin
				direction.copy(abPerp);
			} else {
				// Set direction to AB towards the origin
				direction.copy(ab);
			}
		} else if (simplex.length === 3) {
			const b = simplex[1];
			const c = simplex[0];
			const ab = b.subed(a);
			const ac = c.subed(a);
			const abc = ab.crossed(ac);

			// Determine if the origin is in the region of the triangle ABC
			if (abc.dot(ac.crossed(a)) > 0) {
				if (ac.dot(ao) > 0) {
					// Remove point B, set direction to AC towards the origin
					simplex.splice(1, 1);
					direction.copy(ac.crossed(ao).cross(ac));
				} else {
					if (ab.dot(ao) > 0) {
						// Remove point C, set direction to AB towards the origin
						simplex.splice(0, 1);
						direction.copy(ab.crossed(ao).cross(ab));
					} else {
						// Remove points B and C, set direction to AO
						simplex.splice(0, 2);
						direction.copy(ao);
					}
				}
			} else {
				if (ab.dot(abc) > 0) {
					// Set direction to AB towards the origin
					direction.copy(ab.crossed(ao).cross(ab));
				} else {
					if (abc.dot(ac) > 0) {
						// Set direction to AC towards the origin
						direction.copy(ac.crossed(ao).cross(ac));
					} else {
						// Set direction to ABC towards the origin
						direction.copy(abc);
					}
				}
			}
		} else if (simplex.length === 4) {
			const c = simplex[2];
			const d = simplex[1];
			const e = simplex[0];
			// const ao = e.negated();
			const ab = d.subed(e);
			const ac = c.subed(e);
			const ad = d.subed(e);
			const abc = ab.crossed(ac);
			const acd = ac.crossed(ad);
			const adb = ad.crossed(ab);

			// Determine if the origin is in the region of the tetrahedron ABCD
			if (abc.dot(e) > 0) {
				simplex.splice(0, 1); // Remove point E
				direction.copy(abc); // Set direction to ABC towards the origin
			} else if (acd.dot(e) > 0) {
				simplex.splice(1, 1); // Remove point D
				direction.copy(acd); // Set direction to ACD towards the origin
			} else if (adb.dot(e) > 0) {
				simplex.splice(2, 1); // Remove point C
				direction.copy(adb); // Set direction to ADB towards the origin
			} else {
				// The origin is inside the tetrahedron, and we have a collision
				return true;
			}
		} else {
			// We should not reach here in a 3D GJK implementation
			return false;
		}

		return false; // GJK iteration continues
	}
};
