import { Vector3 } from "../Cubic.js";
import { Shape, ShapeType } from "../core/Shape.js";
import { AABB } from "../collision/AABB.js";
// eslint-disable-next-line no-unused-vars
import { Face } from "../math/Face.js";

export class ConvexPolygon extends Shape {
	/**
     * @constructor
     * @param {object} params
     * @param {number} [params.type]
     * @param {Vector3[]} params.vertices
     * @param {Face[]} params.faces
     * @param {Vector3[]} params.axes
     */
	constructor({
		type = ShapeType.ConvexPolygon,
		vertices,
		faces,
		axes,
	}) {
		super({type});
		this.type = type;
		this.vertices = vertices;
		this.faces = faces;
		this.axes = axes;
		this.needVerticesUpdate = false;
	}

	//     ULITIES

	/**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
	getFurthestVertex() {
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
		return furthestVertex.clone();
	}

	/**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
	getNearestVertex() {
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