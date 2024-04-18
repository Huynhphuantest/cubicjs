import { Vector3 } from '../../../Cubic.js';
// eslint-disable-next-line no-unused-vars
import { Face } from '../../../math/Face.js';
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
 * @typedef Projection
 * @property {number} min
 * @property {number} max
*/

export const SAT = {
	/**
     * @param {ConvexPolygon} a
     * @param {ConvexPolygon} b
     * @param {Body} objA
     * @param {Body} objB
     * @returns {CollisionResult}
     */
	isColliding (a, b, objA, objB) {
		const worldAVertices = a.vertices.map(v =>
			v.clone()
				.applyQuaternion(objA.quaternion)
				.add(objA.position)
		);
		const worldBVertices = b.vertices.map(v =>
			v.clone()
				.applyQuaternion(objB.quaternion)
				.add(objB.position)
		);
		const worldAAxes = a.axes.map(v =>
			v.clone()
				.applyQuaternion(objA.quaternion)
		);
		const worldBAxes = b.axes.map(v =>
			v.clone()
				.applyQuaternion(objB.quaternion)
		);
		const resultA = this.separatingAxis(a, objA, worldAAxes, worldAVertices, worldBVertices);
		const resultB = this.separatingAxis(b, objB, worldBAxes, worldBVertices, worldAVertices);
		if (resultA !== null && resultB !== null) {
			let result;
			if (resultA.penetration < resultB.penetration) { result = resultA; } else { result = resultB; }

			return {
				info: new CollisionInfo({
					normal: result.axis,
					points: this.findContactPoints(worldAVertices, worldBVertices, worldAAxes, worldBAxes, objA, objB),
					penetration: result.penetration
				})
			};
		}
		return {
			info: null
		};
	},
	/**
     * @typedef seperatingAxisResult
     * @property {number} penetration
     * @property {Vector3} axis
     */
	/**
     * @param {ConvexPolygon} shapeA
     * @param {Body} objA
	 * @param {Vector3[]} axes
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
     * @returns {null | seperatingAxisResult}
     */
	separatingAxis (shapeA, objA, axes, worldAVertices, worldBVertices) {
		let minDepth = Infinity;
		const axisFound = new Vector3();
		for (const axis of axes) {
			const { min: minA, max: maxA } = this.project(worldAVertices, axis);
			const { min: minB, max: maxB } = this.project(worldBVertices, axis);

			const depth = this.calculatePenetrationDepth({
				min: minA,
				max: maxA
			}, {
				min: minB,
				max: maxB
			});

			if (Math.max(minA, minB) > Math.min(maxA, maxB)) {
				return null;
			}

			if (depth < 0) continue;
			if (depth < minDepth) {
				minDepth = depth;
				axisFound.copy(axis);
			}
		}
		if (minDepth === Infinity) return null;
		return {
			penetration: minDepth,
			axis: axisFound
		};
	},
	/**
     * @param {Projection} projectionA
     * @param {Projection} projectionB
     * @returns {number}
     */
	calculatePenetrationDepth (projectionA, projectionB) {
		return Math.min(projectionB.max - projectionA.min, projectionA.max - projectionB.min);
	},
	/**
     * @param {Vector3[]} vertices
     * @param {Vector3} axis
     * @returns {Projection}
     */
	project (vertices, axis) {
		let min = Infinity;
		let max = -Infinity;
		for (const v of vertices) {
			const dot = (
				v
			).dot(axis);

			if (dot < min) min = dot;
			if (dot > max) max = dot;
		}
		return {
			min,
			max
		};
	},

	/**
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
	 * @param {Vector3[]} axesA
	 * @param {Vector3[]} axesB
     * @param {Body} objA
     * @param {Body} objB
     * @returns {Vector3[]}
     */
	findContactPoints (worldAVertices, worldBVertices, axesA, axesB, objA, objB) {
		/** @type {Vector3[]} */
		const contactPoints = [];

		const allVerticesAOverlapB = this.filterVerticesIntersectingShape(worldAVertices, worldBVertices, axesB);
		contactPoints.push(...allVerticesAOverlapB);
		const allVerticesBOverlapA = this.filterVerticesIntersectingShape(worldBVertices, worldAVertices, axesA);
		contactPoints.push(...allVerticesBOverlapA);

		return contactPoints;
	},

	/**
     * @param {Vector3[]} worldAVertices
	 * @param {Vector3[]} worldBVertices
	 * @param {Vector3[]} axes
     * @returns {Vector3[]}
     */
	filterVerticesIntersectingShape (worldAVertices, worldBVertices, axes) {
		/** @type {Vector3[]} */
		let filtered = worldAVertices;
		for (const axis of axes) {
			/** @type {Vector3[]} */
			const filteredInAxis = [];
			const { min, max } = this.project(worldBVertices, axis);
			for (const vertex of filtered) {
				const projection = vertex.dot(axis);
				if (projection > min && projection < max) filteredInAxis.push(vertex);
			}
			filtered = filteredInAxis;
		}
		return filtered;
	},

	/**
     * @param {Vector3[]} vertices
     * @returns {Vector3}
     */
	getCenter (vertices) {
		const center = new Vector3();
		for (const vertex of vertices) {
			center.x += vertex.x;
			center.y += vertex.y;
			center.z += vertex.z;
		}
		center.x /= vertices.length;
		center.y /= vertices.length;
		center.z /= vertices.length;
		return center;
	}
};
