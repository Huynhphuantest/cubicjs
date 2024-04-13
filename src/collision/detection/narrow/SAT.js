import { Vector3 } from "../../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import { Face } from "../../../math/Face.js";
// eslint-disable-next-line no-unused-vars
import { ConvexPolygon } from "../../../shape/ConvexPolygon.js";
// eslint-disable-next-line no-unused-vars
import { NarrowPhase } from "./NarrowPhase.js";
// eslint-disable-next-line no-unused-vars
import { CollisionInfo } from "../../CollisionInfo.js";
// eslint-disable-next-line no-unused-vars
import { Body } from "../../../Cubic.js";

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
	isColliding(a, b, objA, objB) {
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
        let resultA = this.separatingAxis(a, b, objA, objB, worldAVertices, worldBVertices);
        let resultB = this.separatingAxis(b, a, objB, objA, worldBVertices, worldAVertices);
        if(resultA !== null && resultB !== null) {
            let result;
            if(resultA.penetration < resultB.penetration)
                result = resultA;
            else
                result = resultB;

            return {
                info: new CollisionInfo({
                    normal: result.axis,
                    points: result === resultA ?
                        this.findContactPoints(a, b, objA, objB) :
                        this.findContactPoints(b, a, objB, objA),
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
     * @param {ConvexPolygon} shapeB
     * @param {Body} objA
     * @param {Body} objB
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
     * @returns {null | seperatingAxisResult}
     */
    separatingAxis(shapeA, shapeB, objA, objB, worldAVertices, worldBVertices) {
        let minDepth = Infinity;
        let axisFound = new Vector3();
        for(const axisLocal of shapeA.axes) {
            const axis = axisLocal.clone().applyQuaternion(objA.quaternion);
            let { min: minA, max: maxA} = this.project(worldAVertices, axis);
            let { min: minB, max: maxB} = this.project(worldBVertices, axis);
            
            let depth = this.calculatePenetrationDepth({ 
                min: minA,
                max: maxA
            }, {
                min: minB,
                max: maxB
            });
            
            if(depth < 0) continue;
            if(depth < minDepth) {
                minDepth = depth;
                axisFound.copy(axis);
            }

            if(Math.max(minA, minB) > Math.min(maxA, maxB)) {
                return null;
            }
        }
        if(minDepth === Infinity) return null;
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
    calculatePenetrationDepth(projectionA, projectionB) {
        return Math.min(projectionB.max - projectionA.min, projectionA.max - projectionB.min);
    },
    /**
     * @param {Vector3[]} vertices
     * @param {Vector3} axis
     * @returns {Projection}
     */
    project(vertices, axis) {
        let min =  Infinity;
        let max = -Infinity;
        for(const v of vertices) {
            const dot = (
                v
            ).dot(axis);

            if(dot < min) min = dot;
            if(dot > max) max = dot;
        }
        return {
            min,
            max
        };
    },

    /**
     * @param {ConvexPolygon} shapeA
     * @param {ConvexPolygon} shapeB
     * @param {Body} objA
     * @param {Body} objB
     * @returns {Vector3[]}
     */
    findContactPoints(shapeA, shapeB, objA, objB) {
        /**@type {Vector3[]} */
        let contactPoints = [];

        const vertices1 = shapeA.vertices.map(vertex => vertex
            .clone()
            .applyQuaternion(objA.quaternion)
            .add(objA.position)
        );
        const vertices2 = shapeB.vertices.map(vertex => vertex
            .clone()
            .applyQuaternion(objB.quaternion)
            .add(objB.position)
        );

        const allVerticesAOverlapB = this.filterVerticesIntersectingShape(vertices1, shapeB, objB);
        contactPoints.push(...allVerticesAOverlapB);
        const allVerticesBOverlapA = this.filterVerticesIntersectingShape(vertices2, shapeA, objA);
        contactPoints.push(...allVerticesBOverlapA);

        return contactPoints;
    },

    /**
     * @param {Vector3[]} worldVertices
     * @param {ConvexPolygon} shape
     * @param {Body} obj
     * @returns {Vector3[]}
     */
    filterVerticesIntersectingShape(worldVertices, shape, obj) {
        /**@type {Vector3[]} */
        let filtered = worldVertices;
        for(const axisLocal of shape.axes) {
            /**@type {Vector3[]} */
            const filteredInAxis = [];
            const axis = axisLocal.applyQuaternion(obj.quaternion);
            const {min, max} = this.project(shape.vertices, axis);
            for(const vertex of filtered) {
                const projection = vertex.dot(axis);
                if(projection > min && projection < max) filteredInAxis.push(vertex);
            }
            filtered = filteredInAxis;
        }
        return filtered;
    },

    /**
     * @param {Vector3[]} vertices 
     * @returns {Vector3}
     */
    getCenter(vertices) {
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