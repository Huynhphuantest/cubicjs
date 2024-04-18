import { Sphere, Vector3 } from '../Cubic.js';
/* eslint-disable-next-line no-unused-vars */
import { Face } from '../math/Face.js';
// eslint-disable-next-line no-unused-vars
import { Body } from './Body.js';
import { SAP } from '../collision/detection/broad/SAP.js';
// import GJK from "../collision/detection/narrow/GJK.js";
import { SAT } from '../collision/detection/narrow/SAT.js';
import { CollisionInfo } from '../collision/CollisionInfo.js';
import { ConvexPolygon } from '../shape/ConvexPolygon.js';
import { Impulse } from '../collision/resolution/Impulse.js';
import { projectedPointInPolygon } from '../collision/detection/point.js';
import { EventType } from './EventDispatcher.js';

/**
 * @typedef {import('../collision/detection/narrow/NarrowPhase.js').CollisionResult} CollisionResult
 */

export class World {
	/**
     * @constructor
     * @param {object} config
     * @param {Vector3} [config.gravity] - This define the velocity added each step to all objects in world
     */
	constructor ({
		gravity = new Vector3()
	}) {
		/** @constant */
		this.gravity = gravity;

		/**
         * @type {Body[]}
         * @constant
         */
		this.bodys = [];
	}

	/**
     * @param {number} deltaTime
     */
	step (deltaTime) {
		if (deltaTime == 0) return;
		// If delta time will it reverse time?
		this.bodys.forEach(body => {
			body.update(this, deltaTime);
			body.velocity.add(this.gravity.clone().mulScalar(deltaTime * body.mass));
		});

		// COLLISION CHECKING
		//   BROAD PHASE
		const pairs = SAP.getPotentialCollision(this.bodys);

		//   NARROW PHASE
		for (const pair of pairs) {
			// Use SAP again too get potential collision in each Body

			// if(!pair.a.worldInfo.AABB.overlaps(pair.b.worldInfo.AABB)) return;
			bodyBody(pair.a, pair.b);
		}
	}

	/**
     * @param {Body} body
     */
	add (body) {
		this.bodys.push(body);
	}
}

/**
 *
 * @param {Body} objA
 * @param {Body} objB
 */
function bodyBody (objA, objB) {
	if (objA.mass === 0 && objB.mass === 0) return;
	for (const shapeA of objA.shapes) {
		for (const shapeB of objB.shapes) {
			/**@type {CollisionInfo | null} */
			let info = null;
			let inverse = false;
			// CONVEX x CONVEX
			if (
				shapeA instanceof ConvexPolygon &&
                shapeB instanceof ConvexPolygon
			) {
				info = convexConvex(objA, objB, shapeA, shapeB);
			}

			// SPHERE x CONVEX
			else if (
				shapeA instanceof Sphere &&
                shapeB instanceof ConvexPolygon
			) {
				info = sphereConvex(objA, objB, shapeA, shapeB);
			}
			// CONVEX x SPHERE
			else if (
				shapeA instanceof ConvexPolygon &&
                shapeB instanceof Sphere
			) {
				inverse = true;
				info = sphereConvex(objB, objA, shapeB, shapeA);
			}

			// SPHERE x SPHERE
			else if (
				shapeA instanceof Sphere &&
                shapeB instanceof Sphere
			) {
				info = sphereSphere(objA, objB, shapeA, shapeB);
			}

			if(info !== null) {
				const collidedEvent = new EventType('collide');
				if(!inverse) {
					Impulse.resolve(objA, objB, info);
				}
				else {
					Impulse.resolve(objB, objA, info);
				}
				collidedEvent.params.info = info;
				collidedEvent.params.body = objB;
				objA.dispatchEvent(collidedEvent);
				collidedEvent.params.body = objA;
				objB.dispatchEvent(collidedEvent);
			}
		}
	}
}

/**
*
* @param {Body} objA
* @param {Body} objB
* @param {Sphere} shapeA
* @param {ConvexPolygon} shapeB
* @returns {CollisionInfo | null}
*/
function sphereConvex (objA, objB, shapeA, shapeB) {
	/**
     * @param {Vector3} corner
     * @returns {CollisionInfo | null}
     */
	function sphereCorner (corner) {
		const difference = corner.subed(objA.position);
		if (difference.lengthSq() < shapeA.radius * shapeA.radius) {
			const normal = difference.normalized();
			const overlap = difference.length();
			const info = new CollisionInfo({
				normal,
				points: [normal.muledScalar(-shapeA.radius).add(objA.position)],
				penetration: Math.max(overlap - shapeA.radius, 0)
			});
			return info;
		}
		return null;
	}

	/**
     * @typedef sphereEdgeResult
     * @property {Vector3} normal
     * @property {Vector3} point
     */
	/**
     * @param {Face} face
     * @returns {CollisionInfo | null}
     */
	function sphereFace (face) {
		const planeNormal = face.normal
			.clone()
			.applyQuaternion(objB.quaternion);

		const worldPoint = face.vertices[0]
			.clone()
			.applyQuaternion(objB.quaternion)
			.add(objB.position);

		const distance = Math.abs(
			worldPoint.dot(planeNormal) -
            objA.position.dot(planeNormal)
		);

		const penetration = distance - shapeA.radius;
		if (penetration > 0) return null;

		const worldFaceVertices = face.vertices.map(vertex =>
			vertex
				.clone()
				.applyQuaternion(objB.quaternion)
				.add(objB.position)
		);

		const sphereClosestPoint = objA.position.added(planeNormal.muledScalar(-shapeA.radius));

		if (!projectedPointInPolygon(worldFaceVertices, objA.position, planeNormal)) {
			// Check for edges

			for (let i = 0; i < worldFaceVertices.length; i++) {
				const vA = worldFaceVertices[(i) % worldFaceVertices.length];
				const vB = worldFaceVertices[(i + 1) % worldFaceVertices.length];
				return sphereEdge(vA, vB);
			}
		}

		// Create collision info object
		const info = new CollisionInfo({
			normal: planeNormal.clone(),
			points: [sphereClosestPoint],
			penetration
		});

		return info;
	}
	/**
     * @param {Vector3} vertexA - First vertex defining the edge.
     * @param {Vector3} vertexB - Second vertex defining the edge.
     * @returns {CollisionInfo | null} - Collision result if collision occurs, otherwise null.
     */
	function sphereEdge (vertexA, vertexB) {
		// Calculate vector from one edge vertex to the sphere center
		const edgeDirection = vertexB.subed(vertexA);
		const edgeToPoint = objA.position.subed(vertexA);

		// Calculate parameter t to find closest point on edge to sphere center
		const t = edgeToPoint.dot(edgeDirection) / edgeDirection.lengthSq();

		// Clamp t to the range [0, 1] to ensure closest point lies within edge segment
		const clampedT = Math.max(0, Math.min(t, 1));

		// Calculate closest point on edge to sphere center
		const closestPoint = vertexA.added(edgeDirection.muledScalar(clampedT));

		// Calculate distance between closest point and sphere center
		const distanceSq = closestPoint.distanceToSq(objA.position);
		const penetration = shapeA.radius - Math.sqrt(distanceSq);

		// Check if distance is less than or equal to sphere radius
		if (penetration < 0) return null;

		// Calculate collision normal
		const normal = closestPoint.subed(objA.position).normalize();

		// Calculate collision point
		const collisionPoint = objA.position.subed(normal.muledScalar(shapeA.radius - penetration));

		return new CollisionInfo({
			normal: normal.clone(),
			points: [collisionPoint],
			penetration
		});
	}

	for (const vertexLocal of shapeB.vertices) {
		const vertex = vertexLocal
			.clone()
			.applyQuaternion(objB.quaternion)
			.add(objB.position);
		const info = sphereCorner(vertex);
		if (info !== null) return info;
	}

	for (const face of shapeB.faces) {
		const info = sphereFace(face);
		if (info !== null) return info;
	}

	return null;
}

/**
 * @param {Body} objA
 * @param {Body} objB
 * @param {Sphere} shapeA
 * @param {Sphere} shapeB
 * @returns {CollisionInfo | null}
 */
function sphereSphere (objA, objB, shapeA, shapeB) {
	const distance = (
		objA.position.distanceToSq(objB.position)
	);
	const totalRadius = (
		(shapeA.radius + shapeB.radius) *
        (shapeA.radius + shapeB.radius)
	);
	if (distance < totalRadius) {
		const overlap = (shapeA.radius + shapeB.radius) - objA.position.distanceTo(objB.position);
		const normal = objB.position.clone().sub(objA.position).normalize();
		return new CollisionInfo({
			points: [objA.position.clone().add(normal.muledScalar(overlap))],
			normal,
			penetration: Math.max(overlap, 0)
		});
	}
	return null;
}

/**
 * @param {Body} objA
 * @param {Body} objB
 * @param {ConvexPolygon} shapeA
 * @param {ConvexPolygon} shapeB
 * @returns {CollisionInfo | null}
 */
function convexConvex (objA, objB, shapeA, shapeB) {
	return SAT.isColliding(shapeA, shapeB, objA, objB).info;
}
