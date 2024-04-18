// eslint-disable-next-line no-unused-vars
import { Vector3, World, Quaternion, Material, ConvexPolygon, Sphere, Mat3 } from '../Cubic.js';
import { AABB } from '../collision/AABB.js';
// eslint-disable-next-line no-unused-vars
import { Shape } from './Shape.js';
import { EventDispatcher } from './EventDispatcher.js';

/**
 * @readonly
 * @enum {number}
 */
const BodyType = {
	DYNAMIC: 0,
	STATIC: 1
};

export class Body extends EventDispatcher {
	/**
     * This represents a RigidBody.
     * @constructor
     * @param {object} params
     * @param {Shape[] | Shape} [params.shapes]
     * @param {number} [params.mass]
	 * @param {Material} [params.material]
     */
	constructor ({
		shapes = [],
		mass = 1,
		material = new Material({ restitution: 0.1 })
	}) {
		super();
		this.shapes = shapes instanceof Array ? shapes : [shapes];
		this.type = BodyType.DYNAMIC;

		this.name = 'UnamedObject';
		this.material = material;

		this.position = new Vector3();
		this.velocity = new Vector3();

		this.quaternion = new Quaternion();
		this.angularVelocity = new Vector3();

		this.mass = mass;
		/** @type number */
		this.invMass;

		// TODO: Add a case where shapes.length is greater than 0
		this.inertia = this.shapes[0].calculateInertia(this.mass);
		this.invInertia = new Vector3();
		/** @type {number} */
		this.inertiaScalar;
		/** @type {number} */
		this.invInertiaScalar;

		this.updateMass();

		/** @description Local */
		this.AABB = new AABB(
			new Vector3(),
			new Vector3()
		);
		if (this.shapes.length != 0) {
			this.updateAABB();
		}
		/** @type {null | Body} */
		this.parrent = null;

		/** @description World infomation of this body, this should not be changed manually */
		this.worldInfo = {
			AABB: new AABB(
				this.AABB.lowerBound.clone().add(this.position),
				this.AABB.upperBound.clone().add(this.position)
			)
		};
		/** @description Previous info of this body, this should not be changed manually */
		this.previousInfo = {
			position: this.position.clone(),
			quaternion: this.quaternion.clone(),
			mass
		};
	}

	/**
     * @param {World} world
     * @param {number} deltaTime
     */
	update (world, deltaTime) {
		// VELOCITY
		if (this.mass !== 0) {
			this.position.add(this.velocity.muledScalar(deltaTime));
		}
		if (!this.angularVelocity.isZero()) {
			// TODO:
			const newQuat = new Quaternion().setFromAxisAngle(this.angularVelocity.normalized(), this.angularVelocity.length() * deltaTime);
			this.quaternion.mulQuaternion(newQuat);
		}

		if (!this.position.equals(this.previousInfo.position)) {
			this.updateWorldPositionAABB();
			this.previousInfo.position.copy(this.position);
		}
		if (!this.quaternion.equals(this.previousInfo.quaternion)) {
			this.updateWorldRotationAABB();
			this.previousInfo.quaternion.copy(this.quaternion);
		}
		if (this.mass != this.previousInfo.mass) {
			this.previousInfo.mass = this.mass;
			this.updateMass();
		}
	}

	updateWorldPositionAABB () {
		this.worldInfo.AABB = new AABB(
			this.AABB.lowerBound.added(this.position),
			this.AABB.upperBound.added(this.position)
		);
	}

	updateWorldRotationAABB () {
		const lowerBound = new Vector3(Infinity, Infinity, Infinity);
		const upperBound = new Vector3(-Infinity, -Infinity, -Infinity);
		for (const shape of this.shapes) {
			if (shape instanceof ConvexPolygon) {
				for (const localVertex of shape.vertices) {
					const vertex = localVertex.clone().applyQuaternion(this.quaternion);
					if (vertex.x < lowerBound.x) lowerBound.x = vertex.x;
					if (vertex.y < lowerBound.y) lowerBound.y = vertex.y;
					if (vertex.z < lowerBound.z) lowerBound.z = vertex.z;

					if (vertex.x > upperBound.x) upperBound.x = vertex.x;
					if (vertex.y > upperBound.y) upperBound.y = vertex.y;
					if (vertex.z > upperBound.z) upperBound.z = vertex.z;
				}
			}
			if (shape instanceof Sphere) {
				if (-shape.radius < lowerBound.x) lowerBound.x = -shape.radius;
				if (-shape.radius < lowerBound.y) lowerBound.y = -shape.radius;
				if (-shape.radius < lowerBound.z) lowerBound.z = -shape.radius;

				if (shape.radius > upperBound.x) upperBound.x = shape.radius;
				if (shape.radius > upperBound.y) upperBound.y = shape.radius;
				if (shape.radius > upperBound.z) upperBound.z = shape.radius;
			}
		}
		this.worldInfo.AABB = new AABB(
			lowerBound.added(this.position),
			upperBound.added(this.position)
		);
	}

	updateAABB () {
		for (const shape of this.shapes) {
			this.AABB.extend(shape.AABB);
		}
	}

	updateMass () {
		this.invMass = this.mass == 0 ? 0 : 1 / this.mass;
		const I = this.inertia;
		this.invInertia.set(
			I.x > 0 ? 1.0 / I.x : 0,
			I.y > 0 ? 1.0 / I.y : 0,
			I.z > 0 ? 1.0 / I.z : 0
		);
		this.inertiaScalar = I.x + I.y + I.z;
		this.invInertiaScalar = this.inertiaScalar == 0 ? 0 : 1 / this.inertiaScalar;
	}

	/**
	 * @param {number | Vector3} x
	 * @param {number} y
	 * @param {number} z
	 */
	translate (x, y, z) {
		if (typeof x === 'number') {
			this.position.add(
				new Vector3(x, y, z).applyQuaternion(this.quaternion)
			);
		} else {
			this.position.add(
				x.applyQuaternion(this.quaternion)
			);
		}
	}
	/**
	 * @param {number | Vector3} x
	 * @param {number} y
	 * @param {number} z
	 */
	rotate (x, y, z) {
		if (typeof x === 'number') {
			const v = new Vector3(x, y, z);
			const l = v.length();
			if(l === 0) return;
			this.quaternion.setFromAxisAngle(
				v.divScalar(l),
				l
			);
		} else {
			const l = x.length();
			if(l === 0) return;
			this.quaternion.setFromAxisAngle(
				x.divScalar(l),
				l
			);
		}
	}
}
