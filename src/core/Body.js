import { Vector3, World, Quaternion } from "../Cubic.js";
import AABB from "../collision/AABB.js";
import Shape from "./Shape.js";

/**
 * @readonly
 * @enum {number}
 */
const BodyType = {
	DYNAMIC: 0,
	STATIC: 1
};

export class Body {
	/**
     * This represents a RigidBody.
     * @constructor
     * @param {object} params
     * @param {Shape[] | Shape} [params.shapes]
     * @param {number} [params.mass]
     */
	constructor({
		shapes = [],
		mass = 1
	}) {
		this.shapes = shapes instanceof Array ? shapes : [shapes];
		this.type = BodyType.DYNAMIC;
		this.mass = mass;
		this.invMass = this.mass === 0 ? 0 : 1 / this.mass;
		this.name = "UnamedObject";

		this.position = new Vector3();
		this.velocity = new Vector3();
		this.quaternion = new Quaternion();
		this.angularVelocity = new Vector3();
		/**@description Local */
		this.AABB = new AABB(
			new Vector3(),
			new Vector3()
		);
		if(this.shapes.length != 0) {
			this.updateAABB();
		}
		/**@type {null | Body} */
		this.parrent = null;



		/**@description World infomation of this body, this should not be changed manually*/
		this.worldInfo = {
			AABB: new AABB(
				this.AABB.lowerBound.clone().add(this.position),
				this.AABB.upperBound.clone().add(this.position)
			)
		};
		/**@description Previous info of this body, this should not be changed manually */
		this.previousInfo = {
			position: {
				x: this.position.x,
				y: this.position.x,
				z: this.position.x
			},
			mass
		};
	}
	/**
     * @param {World} world
     * @param {number} deltaTime 
     */
	update(world, deltaTime) {
		// VELOCITY
		if(this.mass !== 0)
			this.position.add(this.velocity.clone().mulScalar(deltaTime));

		if(
			this.position.x != this.previousInfo.position.x ||
            this.position.y != this.previousInfo.position.y ||
            this.position.z != this.previousInfo.position.z
		) {
			this.previousInfo.position.x = this.position.x,
			this.previousInfo.position.y = this.position.y,
			this.previousInfo.position.z = this.position.z;
			this.updateWorldInfo();
		}
		if(this.mass != this.previousInfo.mass) {
			this.previousInfo.mass = this.mass;
			this.invMass = this.mass == 0 ? 0 : 1 / this.mass;
		}
	}
	updateWorldInfo() {
		this.worldInfo.AABB = new AABB(
			this.AABB.lowerBound.clone().add(this.position),
			this.AABB.upperBound.clone().add(this.position)
		);
	}
	updateAABB() {
		for(const shape of this.shapes) {
			this.AABB.extend(shape.AABB);
		}
	}
}