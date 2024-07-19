// eslint-disable-next-line no-unused-vars
import { Vector3, World, Quaternion, Material, ConvexPolygon, Sphere, Mat3 } from '../Cubic.js';
import { AABB } from '../collision/AABB.js';
// eslint-disable-next-line no-unused-vars
import { Shape } from '../shape/Shape.js';
import { EventDispatcher } from '../core/EventDispatcher.js';

/**
 * @readonly
 * @enum {number}
 */
const BodyType = {
	/**@description Dynamic Body can collide with other Dynamic Body and Static Body */
	DYNAMIC: 0,
	/**@description Static Body can only collide with Dynamic Body */
	STATIC: 1
};

export class Body extends EventDispatcher {
	/**
     * This represents a RigidBody.
     * @constructor
     * @param {object} params
     * @param {Shape} params.shape
     * @param {number} [params.mass]
	 * @param {Material} [params.material]
     */
	constructor ({
		shape,
		mass = 0,
		material = new Material({ restitution: 0.1 })
	}) {
		super();
		this.shapes = [shape];
		/**@description Offsets of each shape in Body */
		this.offsets = [new Vector3()];
		/**@description Orientations of each shape in Body */
		this.orientations = [new Quaternion()];

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
		this.inertia = new Vector3();
		this.shapes.forEach(shape => {
			this.inertia.add(shape.calculateInertia(this.mass));
		});

		this.invInertia = new Vector3();
		/** @type {number} */
		this.inertiaScalar;
		/** @type {number} */
		this.invInertiaScalar;

		this.updateMassProperties();

		/** @description Local */
		this.AABB = new AABB(
			new Vector3(),
			new Vector3()
		);
		this.updateAABB();

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
			this.quaternion.integrate(this.angularVelocity, deltaTime);
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
			this.updateMassProperties();
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
		for(const shape of this.shapes) {
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
		this.shapes.forEach(shape => {
			this.AABB.extend(shape.AABB);
		});
	}

	updateMassProperties () {
		this.invMass = this.mass === 0 ? 0 : 1 / this.mass;
		const I = this.inertia;
		for(const shape of this.shapes) {
			I.add(shape.calculateInertia(this.mass));
		}
		const iI = this.invInertia;
		iI.set(
			I.x === 0 ? 0 : 1.0 / I.x,
			I.y === 0 ? 0 : 1.0 / I.y,
			I.z === 0 ? 0 : 1.0 / I.z
		);
		this.inertiaScalar = (I.x + I.y + I.z) / 3;
		this.invInertiaScalar = (iI.x + iI.y + iI.z) / 3;
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
	/**
	 * @param {Vector3} impulse
	 * @param {Vector3} relative
	 */
	applyImpulse(impulse, relative) {
		if(this.mass === 0) return;
		this.velocity.add(impulse.muled(this.invMass));
		this.angularVelocity.add(
			relative
				.crossed(impulse)
				.mulScalar(this.invInertiaScalar)
		);
	}
}
