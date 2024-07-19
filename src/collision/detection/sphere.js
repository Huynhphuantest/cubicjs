// eslint-disable-next-line no-unused-vars
import { Sphere, ConvexPolygon, Vector3, Quaternion, Body, Face } from '../../Cubic';
import { Edge } from '../../math/Edge';
// eslint-disable-next-line no-unused-vars
import { CollisionInfo } from '../CollisionInfo';
// eslint-disable-next-line no-unused-vars
import { projectedPointInPolygon } from './point';


/**
 * @param {Body} sphereObject
 * @param {Sphere} sphereShape
 * @param {Vector3} vertex
 * @returns {CollisionInfo | null}
 */
function sphereVertex(sphereObject, sphereShape, vertex) {
	const difference = vertex.subed(sphereObject.position);
	if (difference.lengthSq() < sphereShape.radius * sphereShape.radius) {
		const normal = difference.normalized();
		const overlap = difference.length();
		const info = new CollisionInfo({
			normal,
			points: [normal.muledScalar(-sphereShape.radius).add(sphereObject.position)],
			penetration: Math.max(overlap - sphereShape.radius, 0)
		});
		return info;
	}
	return null;
}

/**
 * @param {Body} sphereObject
 * @param {Sphere} sphereShape
 * @param {Vector3} faceNormal
 * @param {Vector3[]} faceWorldVertices
 * @returns {CollisionInfo | null}
 */
function sphereFace(sphereObject, sphereShape, faceNormal, faceWorldVertices) {
	const worldPoint = faceWorldVertices[0];
	const distance = Math.abs(
		worldPoint.dot(faceNormal) -
		sphereObject.position.dot(faceNormal)
	);

	const penetration = distance - sphereShape.radius;
	if (penetration > 0) return null;

	const sphereClosestPoint = sphereObject.position.added(faceNormal.muledScalar(-sphereShape.radius));

	// Create collision info object
	const info = new CollisionInfo({
		normal: faceNormal.negated(),
		points: [sphereClosestPoint],
		penetration: -penetration
	});

	return info;
}
/**
 * @param {Body} sphereObj
 * @param {Sphere} sphereShape
 * @param {Edge} edge - World Edge
 * @returns {CollisionInfo | null} - Collision result if collision occurs, otherwise null.
 */
function sphereEdge (sphereObj, sphereShape, edge) {
	//const edgeToPoint = sphereObj.position.subed(edge.a);

	// Calculate parameter t to find closest point on edge to sphere center
	const t = sphereObj.position.dot(edge.direction) - edge.a.dot(edge.direction);
	if(t > edge.length || t < 0) return null;
	// If t is outside of 1, it is either touching the corner or i don't wtf happend

	// Calculate closest point on edge to sphere center
	const closestPoint = edge.a.added(edge.direction.muledScalar(t));
	
	// Calculate distance between closest point and sphere center
	const distance = closestPoint.distanceTo(sphereObj.position);
	const penetration = sphereShape.radius - distance;
	
	// Check if distance is less than or equal to sphere radius
	if (penetration < 0) return null;
	//console.plot.point(closestPoint, 1);
	
	// Calculate collision normal
	const normal = closestPoint.subed(sphereObj.position).normalized(-1);

	return new CollisionInfo({
		normal,
		points:[closestPoint],
		penetration: -penetration
	});
}
/**
*
* @param {Body} objA
* @param {Body} objB
* @param {Sphere} shapeA
* @param {ConvexPolygon} shapeB
* @returns {CollisionInfo | null}
*/
export function sphereConvex (objA, objB, shapeA, shapeB) {
	const worldVertices = shapeB.vertices.map(vertex => {
		return vertex
			.clone()
			.applyQuaternion(objB.quaternion)
			.add(objB.position);
	});
	// Corners vs Sphere
	for (const vertex of worldVertices) {
		const info = sphereVertex(objA, shapeA, vertex);
		if (info !== null) return info;
	}

	// Getting edge in world coordinates

	// TODO: Calculate the direction too?
	const worldEdges = shapeB.edges.map(edge => 
		new Edge(
			worldVertices[edge.indices[0]],
			worldVertices[edge.indices[1]],
		)
	);
	// and Face vs Sphere
	// // Should only have one
	// // If the sphere not touching face then it could only be in
	// // contact with on edge since contacting 2 edge is contacting a corner
	let sphereEdgeResult = null;
	for (let i = 0; i < shapeB.faces.length; i++) {
		const vertices = shapeB.faces[i].indices.map(index => worldVertices[index]);
		const normal = shapeB.faces[i].normal
			.clone()
			.applyQuaternion(objB.quaternion);
		const info = sphereFace(objA, shapeA, normal, vertices);
		const isSpherePostionProjectedInFace = projectedPointInPolygon(vertices, objA.position, normal);
		if(info != null && isSpherePostionProjectedInFace) return info;
		if(isSpherePostionProjectedInFace) continue;
		// Edge vs Sphere
		for(const edge of worldEdges) {
			//if(sphereEdgeResult) console.log('wtf how did we get here')
			const sphereEdgeInfo = sphereEdge(objA, shapeA, edge);
			if(sphereEdgeInfo) sphereEdgeResult = sphereEdgeInfo;
		}
	}
	if(sphereEdgeResult != null) return sphereEdgeResult;
	return null;
}

/**
 * @param {Body} objA
 * @param {Body} objB
 * @param {Sphere} shapeA
 * @param {Sphere} shapeB
 * @returns {CollisionInfo | null}
 */
export function sphereSphere (objA, objB, shapeA, shapeB) {
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