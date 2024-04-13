import { Vector3 } from "./Vector3.js";
export class Face {
	/**
	 * @param {Vector3[]} vertices 
	 * @param {Vector3} [normal]
	 */
	constructor(vertices, normal) {
		this.vertices = vertices;
		this.normal = normal !== undefined ?
			normal 
				:
			computeNormal(vertices);
	}
}
/**
 * Compute normal vector from vertices of a face of a Convex Polyhedron
 * @param {Vector3[]} vertices 
 */
function computeNormal(vertices) { 
	const normal = new Vector3();

	for(let i = 0; i < vertices.length; i++) {

		const current = vertices[i];
		const next = vertices[(i + 1) % vertices.length];

		normal.add(
			(current.y - next.y) * (current.z + next.z),
			(current.z - next.z) * (current.x + next.x),
			(current.z - next.z) * (current.y + next.y)
		);
	}

	return normal.normalize();
}