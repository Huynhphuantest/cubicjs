import { Sphere, Vector3 } from "../Cubic.js";
/* eslint-disable-next-line no-unused-vars */
import Face from "../math/Face.js";
// eslint-disable-next-line no-unused-vars
import { Body } from "./Body.js";
import SAP from "../collision/detection/broad/SAP.js";
import GJK from "../collision/detection/narrow/GJK.js";
import SAT from "../collision/detection/narrow/SAT.js";
import CollisionInfo from "../collision/CollisionInfo.js";
import ConvexPolygon from "../shape/ConvexPolygon.js";
import Impulse from "../collision/resolution/Impulse.js";

/**
 * @typedef {import('../collision/detection/narrow/NarrowPhase.js').CollisionResult} CollisionResult
 */

export default class World {
	/**
     * @constructor
     * @param {object} config
     * @param {Vector3} [config.gravity] - This define the velocity added each step to all objects in world
     */
	constructor({
		gravity = new Vector3(),
	}) {
		/**@constant */
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
	step(deltaTime) {
		if(deltaTime == 0) return;
		// If delta time will it reverse time?
		this.bodys.forEach(body => {
			body.update(this, deltaTime);
            body.velocity.add(this.gravity.clone().mulScalar(deltaTime * body.mass));
		});

		// COLLISION CHECKING
		//   BROAD PHASE
		const pairs = SAP.getPotentialCollision(this.bodys);



		//   NARROW PHASE
		for(const pair of pairs) {
			//Use SAP again too get potential collision in each Body
			bodyBody(pair.a, pair.b );
		}


	}
	/**
     * @param {Body} body
     */
	add(body) {
		this.bodys.push(body);
	}
}

/**
 * 
 * @param {Body} objA 
 * @param {Body} objB 
 */
function bodyBody(objA, objB) {
	for(const shapeA of objA.shapes) {
		for(const shapeB of objB.shapes) {
			// CONVEX x CONVEX
			if(
				shapeA instanceof ConvexPolygon &&
                shapeB instanceof ConvexPolygon
			) {
                convexConvex(objA, objB, shapeA, shapeB);
			}



			// SPHERE x CONVEX
			if(
				shapeA instanceof Sphere &&
                shapeB instanceof ConvexPolygon
			) {
				sphereConvex(objA, objB, shapeA, shapeB);
			}
			// CONVEX x SPHERE
			if(
				shapeA instanceof ConvexPolygon &&
                shapeB instanceof Sphere
			) {
				sphereConvex(objB, objA, shapeB, shapeA);
			}



			//SPHERE x SPHERE
			else if(
				shapeA instanceof Sphere && 
                shapeB instanceof Sphere
			) {
				sphereSphere(objA, objB, shapeA, shapeB);
			}
		}
	}
}
/**
 * @param {Body} objA 
 * @param {Body} objB 
 * @param {Sphere} shapeA 
 * @param {ConvexPolygon} shapeB
 * @author {Schteppe - CannonJS} - i stealed it from here (it is a pain to convert his code to mine)
 */
function sphereConvex(objA, objB, shapeA, shapeB) {
	//SAT
    const faces = shapeB.faces;
    const verts = shapeB.vertices;
    const R =     shapeA.radius;
	let found = false;

    // Check corners
    for(let i = 0; i < verts.length; i++){
        const v = verts[i];

        // World position of corner
        const worldCorner = v.clone().applyQuaternion(objB.quaternion);
        worldCorner.add(objB.position);
        const sphereToCorner = worldCorner.subed(objA.position);
        if(sphereToCorner.lengthSq() < R * R) {
            found = true;
			//FIXME: Add depth and points
			const normal = sphereToCorner.normalized();
			const info = new CollisionInfo({
				normal,
				depth: NaN,
				points: []
			});
			Impulse.resolve(objA, objB, info);
            return;
        }
    }

    // Check side (plane) intersections
    for(let i = 0; i < faces.length && found === false; i++){
		const normal = faces[i].normal;
        const face = faces[i].vertices;

        // Get world-transformed normal of the face
        const worldNormal = normal.clone().applyQuaternion(objB.quaternion);

        // Get a world vertex from the face
        const worldPoint = face[0].clone().applyQuaternion(objB.quaternion);
        worldPoint.add(objB.position);

        // Get a point on the sphere, closest to the face normal
        const worldSpherePointClosestToPlane = worldNormal.muledScalar(-R);
        worldSpherePointClosestToPlane.add(objA.position);

        // Vector from a face point to the closest point on the sphere
        const penetrationVec = worldSpherePointClosestToPlane.subed(worldPoint);

        // The penetration. Negative value means overlap.
        const penetration = penetrationVec.dot(worldNormal);

        const worldPointToSphere = objA.position.subed(worldPoint);

        if(penetration < 0 && worldPointToSphere.dot(worldNormal) > 0) {
            // Intersects plane. Now check if the sphere is inside the face polygon
            const faceVerts = []; // Face vertices, in world coords
            for(let j = 0; j < face.length; j++){
                const worldVertex = face[j].clone().applyQuaternion(objB.quaternion);
                worldVertex.add(objB.position);
                faceVerts.push(worldVertex);
            }

            if(pointInPolygon(faceVerts,worldNormal,objA.position)){ // Is the sphere center in the face polygon?
                found = true;
                //FIXME: Add depth and points
				const info = new CollisionInfo({
					normal: worldNormal.negated(),
					depth:NaN,
					points: []
				});
                Impulse.resolve(objA, objB, info);

                return; // We only expect *one* face contact
            } else {
                // Edge?
                for(let j = 0; j < face.length; j++){

                    // Get two world transformed vertices
                    const v1 = face[(j+1)%face.length].clone().applyQuaternion(objB.quaternion);
                    const v2 = face[(j+2)%face.length].clone().applyQuaternion(objB.quaternion);
                    v1.add(objB.position);
                    v1.add(objB.position);

                    // Construct edge vector
                    const edge = v2.subed(v1);

                    // Construct the same vector, but normalized
                    const edgeUnit = edge.normalized();
                    if(edgeUnit.lengthSq() === 0) {
                        edgeUnit.set(1,0,0);
                    }

                    const v1_to_xi = objA.position.subed(v1);
                    const dot = v1_to_xi.dot(edgeUnit);
                    // p is xi projected onto the edge
                    const p = edgeUnit.muledScalar(dot);
                    p.add(v1);

                    // Compute a vector from p to the center of the sphere
                    const xi_to_p = p.subed(objA.position);

                    // Collision if the edge-sphere distance is less than the radius
                    // AND if p is in between v1 and v2
                    if(dot > 0 && dot*dot<edge.lengthSq() && xi_to_p.lengthSq() < R*R){ // Collision if the edge-sphere distance is less than the radius
                        // Edge contact!
                        //FIXME: Add depth and points
                        const info = new CollisionInfo({
                            normal: p.subed(objA.position).normalize(),
                            points: [],
                            depth: NaN
                        });
                        Impulse.resolve(objA, objB, info);

                        return;
                    }
                }
            }
        }
    }

}
/**
 * @param {Vector3[]} verts 
 * @param {Vector3} normal 
 * @param {Vector3} p 
 * @returns 
 */
function pointInPolygon(verts, normal, p){
    let positiveResult = null;
    const N = verts.length;
    for(let i = 0; i < N; i++) {
        const v = verts[i];

        // Get edge to the next vertex
        const edge = verts[(i+1) % (N)].subed(v);

        // Get cross product between polygon normal and the edge
        const edge_x_normal = edge.crossed(normal);

        // Get vector between point and current vertex
        const vertex_to_p = p.subed(v);

        // This dot product determines which side of the edge the point is
        const r = edge_x_normal.dot(vertex_to_p);

        // If all such dot products have same sign, we are inside the polygon.
        if(positiveResult===null || (r>0 && positiveResult===true) || (r<=0 && positiveResult===false)){
            if(positiveResult===null){
                positiveResult = r>0;
            }
            continue;
        } else {
            return false; // Encountered some other sign. Exit.
        }
    }

    // If we got here, all dot products were of the same sign.
    return true;
}

/**
 * @param {Body} objA 
 * @param {Body} objB 
 * @param {Sphere} shapeA 
 * @param {Sphere} shapeB 
 */
function sphereSphere(objA, objB, shapeA, shapeB) {
	const distance = (
		objA.position.distanceToSq(objB.position)
	);
	const totalRadius = (
		(shapeA.radius + shapeB.radius) *
        (shapeA.radius + shapeB.radius)
	);
	if(distance < totalRadius) {
        const normal = objA.position.clone().sub(objB.position).normalize();
        const info = new CollisionInfo({
            points: [objA.position.clone().add(normal.muledScalar(shapeA.radius))],
            normal,
            depth: distance - totalRadius
        });
		Impulse.resolve(objA, objB, info);
	}
}

/**
 * @param {Body} objA 
 * @param {Body} objB 
 * @param {ConvexPolygon} shapeA 
 * @param {ConvexPolygon} shapeB 
 */
function convexConvex(objA, objB, shapeA, shapeB) {
    const result = SAT.isColliding(shapeA, shapeB, objA, objB);
    if(result.info !== null) {
        Impulse.resolve(objA, objB, result.info);
    }
}