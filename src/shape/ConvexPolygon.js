import { Vector3 } from "../Cubic.js";
import Shape from "../core/Shape.js";
import AABB from "../collision/AABB.js";
// eslint-disable-next-line no-unused-vars
import Face from "../math/Face.js";

export default class ConvexPolygon extends Shape {
	/**@type {Vector3 | null} */
	#furthestVertex = null;
	/**@type {Vector3 | null} */
	#nearestVertex = null;
	/**
     * @constructor
     * @param {object} params
     * @param {number} params.type
     * @param {Vector3[]} params.vertices
     * @param {Face[]} params.faces
     * @param {Vector3[]} params.aces
     */
	constructor({
		type,
		vertices,
		faces,
		aces
	}) {
		super({type});
		this.vertices = vertices;
		this.faces = faces;
		this.aces = aces;
		this.needVerticesUpdate = false;
		this.updateBoundingSphereRadius();
		this.updateAABB();
	}

	//     ULITIES

	/**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
	getFurthestVertex() {
		if(this.#furthestVertex != null)
			return this.#furthestVertex;
		let furthestVertex;
		let furthestDistance = -Infinity;
		for(const vertex of this.vertices) {
			const distance = vertex.length();
			if(distance > furthestDistance) {
				furthestDistance = distance;
				furthestVertex = vertex;
			}
		}
		if(furthestVertex === undefined) throw new Error("This ConvexPolygons does not contain any vertex");
		this.#furthestVertex = furthestVertex;
		return furthestVertex.clone();
	}

	/**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
	getNearestVertex() {
		if(this.#nearestVertex != null)
			return this.#nearestVertex;
		let nearestVertex;
		let nearestDistance = Infinity;
		for(const vertex of this.vertices) {
			const distance = vertex.length();
			if(distance < nearestDistance) {
				nearestDistance = distance;
				nearestVertex = vertex;
			}
		}
		if(nearestVertex === undefined) throw new Error("This ConvexPolygons does not contain any vertex");
		this.#nearestVertex = nearestVertex;
		return nearestVertex.clone();
	}

	/**
     * This method is used for GJK
     * @param {Vector3} direction
     * @returns {Vector3}
     */
	getFurthestVertexInDirection(direction) {
		let furthestVertex;
		let furthestDistance = -Infinity;
		for(const vertex of this.vertices) {
			const distance = vertex.dot(direction);
			if (distance > furthestDistance) {
				furthestDistance = distance;
				furthestVertex = vertex;
			}
		}
		if(furthestVertex === undefined) throw new Error("This ConvexPolygon does not contain any vertex");
		return furthestVertex.clone();
	}
	/** */
	updateBoundingSphereRadius() {
		this.boundingSphereRadius = this.getFurthestVertex().length();
	}
	updateAABB() {
		let
			minX = Infinity,
			minY = Infinity,
			minZ = Infinity,
			maxX = -Infinity,
			maxY = -Infinity,
			maxZ = -Infinity;
		for(const vertex of this.vertices) {
			if(vertex.x < minX) minX = vertex.x;
			else if(vertex.x > maxX) maxX = vertex.x;

			if(vertex.y < minY) minY = vertex.y;
			else if(vertex.y > maxY) maxY = vertex.y;

			if(vertex.z < minZ) minZ = vertex.z;
			else if(vertex.z > maxZ) maxZ = vertex.z;
		}

		this.AABB = new AABB(
			new Vector3(minX, minY, minZ),
			new Vector3(maxX, maxY, maxZ)
		);
	}
}