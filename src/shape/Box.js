import ConvexPolygon from "./ConvexPolygon.js";
import { Vector3 } from "../Cubic.js";
import { ShapeType } from "../core/Shape.js";
import Face from "../math/Face.js";

/**
 * @private
 * @typedef boxShape
 * @property {Vector3[]} vertices
 * @property {Face[]} faces
 * @property {Vector3[]} aces
 */
/**
 * @private
 * @param {number} w 
 * @param {number} h 
 * @param {number} d 
 * @returns {boxShape}
 */
function buildShape(w, h, d) {
	/**@type {Vector3[]} */
	const vertices = [
		new Vector3(-w, -h, -d),
		new Vector3( w, -h, -d),
		new Vector3( w,  h, -d),
		new Vector3(-w,  h, -d),
		new Vector3(-w, -h,  d),
		new Vector3( w, -h,  d),
		new Vector3( w,  h,  d),
		new Vector3(-w,  h,  d)
	];

	/**@type {Face[]} */
	const faces = [
		new Face([vertices[3],vertices[2],vertices[1],vertices[0]], new Vector3( 0, 0,-1)),
		new Face([vertices[4],vertices[5],vertices[6],vertices[7]], new Vector3( 0, 0, 1)),
		new Face([vertices[5],vertices[4],vertices[0],vertices[1]], new Vector3( 0,-1, 0)),
		new Face([vertices[2],vertices[3],vertices[7],vertices[6]], new Vector3( 0, 1, 0)),
		new Face([vertices[0],vertices[4],vertices[7],vertices[3]], new Vector3(-1, 0, 0)),
		new Face([vertices[1],vertices[2],vertices[6],vertices[5]], new Vector3( 1, 0, 0)),
	];

	/**@type {Vector3[]} */
	const aces = [
		new Vector3(0, 0, 1),
		new Vector3(0, 1, 0),
		new Vector3(1, 0, 0)
	];

	return {
		vertices,
		faces,
		aces,
	};
}
export default class Box extends ConvexPolygon {
	/**
     * @constructor
     * @param {number|Vector3} width
     * @param {number} [height] 
     * @param {number} [depth]
     */
	constructor(width, height, depth) {
		let 
			/**@type {number} */
			w, 
			/**@type {number} */
			h, 
			/**@type {number} */
			d;
		if(width instanceof Vector3) {
			w = width.x;
			h = width.y;
			d = width.z;
		} else if(height == undefined) {
			w = width;
			h = width;
			d = width;
		} else {
			w = width;
			h = height;
			d = depth ?? 0;
		}
		const {
			vertices,
			faces,
			aces,
		} = buildShape(
			w/2,
			h/2,
			d/2
		);
		super({
			type: ShapeType.Box,
			vertices,
			faces,
			aces
		});
        
		this.parameters = {
			width:w,
			height:h,
			depth:d
		};
	}
	updateBoundingSphereRadius() {
		this.boundingSphereRadius = Math.sqrt(
			this.parameters.width  * this.parameters.width +
            this.parameters.height * this.parameters.height +
            this.parameters.depth  * this.parameters.depth
		);
	}
}