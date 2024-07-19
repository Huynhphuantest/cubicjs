import { Sphere, Vector3 } from '../Cubic.js';
/* eslint-disable-next-line no-unused-vars */
import { Face } from '../math/Face.js';
// eslint-disable-next-line no-unused-vars
import { Body } from '../objects/Body.js';
import { SAP } from '../collision/detection/broad/SAP.js';
// import GJK from "../collision/detection/narrow/GJK.js";
import { SAT } from '../collision/detection/narrow/SAT.js';
// eslint-disable-next-line no-unused-vars
import { CollisionInfo } from '../collision/CollisionInfo.js';
import { ConvexPolygon } from '../shape/ConvexPolygon.js';
import { Impulse } from '../collision/resolution/Impulse.js';
// eslint-disable-next-line no-unused-vars
import { projectedPointInPolygon } from '../collision/detection/point.js';
import { EventType } from './EventDispatcher.js';
import { sphereSphere, sphereConvex } from '../collision/detection/sphere.js';

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
		this.bodys.forEach(body => {
			body.update(this, deltaTime);
			// Mass doesn't matter
			body.velocity.add(this.gravity.clone().mulScalar(deltaTime));
		});

		// COLLISION CHECKING
		//   BROAD PHASE
		const pairs = SAP.getPotentialCollision(this.bodys);

		//   NARROW PHASE
		for (const pair of pairs) {
			// Use SAP again too get potential collision in each Body
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

	//TODO: Take account for multipe shape
	const shapeA = objA.shapes[0];
	const shapeB = objB.shapes[0];

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
