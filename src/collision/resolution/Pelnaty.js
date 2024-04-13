// eslint-disable-next-line no-unused-vars
import { Body } from "../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import { Shape } from "../../core/Shape.js";
// eslint-disable-next-line no-unused-vars
import { ConvexPolygon } from "../../shape/ConvexPolygon.js";
// eslint-disable-next-line no-unused-vars
import { Sphere } from "../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import { CollisionInfo } from "../CollisionInfo.js";

class ImpulseResponse {
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info 
     */
	resolve(objA, objB, info) {
		//TODO: Do this function
	}
}

const Impulse = new ImpulseResponse();
export default Impulse;