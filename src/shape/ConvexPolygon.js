import { Vector3 } from '../Cubic.js';
import { Shape, ShapeType } from './Shape.js';
import { AABB } from '../collision/AABB.js';
// eslint-disable-next-line no-unused-vars
import { Face } from '../math/Face.js';
import { Edge } from '../math/Edge.js';

export class ConvexPolygon extends Shape {
	/**
     * @constructor
     * @param {object} params
	 * @param {Vector3[]} params.vertices
	 * @param {Face[]} params.faces
	 * @param {Vector3[]} params.axes
	 * @param {Edge[]} [params.edges]
     * @param {number} [params.type]
     */
	constructor ({
		type = ShapeType.ConvexPolygon,
		vertices,
		faces,
		axes,
		edges
	}) {
		super({ type });
		this.type = type;
		this.vertices = vertices;
		this.faces = faces;
		this.axes = axes;
		this.needVerticesUpdate = false;
		this.edges = edges ? 
			edges : computeEdges(vertices);
	}

	//     ULITIES

	/**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
	getFurthestVertex () {
		let furthestVertex;
		let furthestDistance = -Infinity;
		for (const vertex of this.vertices) {
			// A^2 > B^2 <=> A > B
			const distance = vertex.lengthSq();
			if (distance > furthestDistance) {
				furthestDistance = distance;
				furthestVertex = vertex;
			}
		}
		if (furthestVertex === undefined) throw new Error('This ConvexPolygons does not contain any vertex');
		return furthestVertex.clone();
	}

	/**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
	getNearestVertex () {
		let nearestVertex;
		let nearestDistance = Infinity;
		for (const vertex of this.vertices) {
			const distance = vertex.lengthSq();
			// A^2 < B^2 <=> A < B
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestVertex = vertex;
			}
		}
		if (nearestVertex === undefined) throw new Error('This ConvexPolygons does not contain any vertex');
		return nearestVertex.clone();
	}

	/**
     * This method is used for GJK
     * @param {Vector3} direction
     * @returns {Vector3}
     */
	getFurthestVertexInDirection (direction) {
		let furthestVertex;
		let furthestDistance = -Infinity;
		for (const vertex of this.vertices) {
			const distance = vertex.dot(direction);
			if (distance > furthestDistance) {
				furthestDistance = distance;
				furthestVertex = vertex;
			}
		}
		if (furthestVertex === undefined) throw new Error('This ConvexPolygon does not contain any vertex');
		return furthestVertex.clone();
	}

	updateBoundingSphereRadius () {
		this.boundingSphereRadius = this.getFurthestVertex().length();
	}

	updateAABB () {
		let
			minX = Infinity;
		let minY = Infinity;
		let minZ = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		let maxZ = -Infinity;
		for (const vertex of this.vertices) {
			if (vertex.x < minX) minX = vertex.x;
			else if (vertex.x > maxX) maxX = vertex.x;

			if (vertex.y < minY) minY = vertex.y;
			else if (vertex.y > maxY) maxY = vertex.y;

			if (vertex.z < minZ) minZ = vertex.z;
			else if (vertex.z > maxZ) maxZ = vertex.z;
		}

		this.AABB = new AABB(
			new Vector3(minX, minY, minZ),
			new Vector3(maxX, maxY, maxZ)
		);
	}
}

/**
 * @param {Vector3[]} vertices 
 * @returns {Edge[]}
 */
function computeEdges(vertices) {
	return [];
}