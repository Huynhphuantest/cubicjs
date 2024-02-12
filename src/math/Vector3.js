// eslint-disable-next-line no-unused-vars
import Vector from "./Vector.js";
// eslint-disable-next-line no-unused-vars
import Quaternion from "./Quaternion.js";

/**
 * 3 Dimensional Vector
 * @implements Vector
 */
export default class Vector3 {
	/**
     * @constructor
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [z]
     */
	constructor(x, y, z) {
		/**@readonly */
		this.isVector = true;
		/**@readonly */
		this.dimension = 3;
		this.x = x ?? 0;
		this.y = y ?? 0;
		this.z = z ?? 0;
	}
	/**
     * @param {number|Vector3} x 
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
	add(x, y, z) {
		if(x instanceof Object) {
			this.x += x.x;
			this.y += x.y;
			this.z += x.z;
		} else {
			this.x += x;
			this.y += y ?? 0;
			this.z += z ?? 0;
		}
		return this;
	}
	/**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
	sub(x, y, z) {
		if(x instanceof Object) {
			this.x -= x.x;
			this.y -= x.y;
			this.z -= x.z;
		} else {
			this.x -= x;
			this.y -= y ?? 0;
			this.z -= z ?? 0;
		}
		return this;
	}
	/**
     * @param {number|Vector3} x 
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
	mul(x, y, z) {
		if(x instanceof Object) {
			this.x *= x.x;
			this.y *= x.y;
			this.z *= x.z;
		} else if(y == undefined) {
			this.x *= x;
			this.y *= x;
			this.z *= x;
		} else {
			this.x *= x;
			this.y *= y ?? 0;
			this.z *= z ?? 0;
		}
		return this;
	}
	/**
     * @param {number|Vector3} x 
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
	div(x, y, z) {
		if(x instanceof Object) {
			this.x /= x.x;
			this.y /= x.y;
			this.z /= x.z;
		} else if(y == undefined) {
			this.x /= x;
			this.y /= x;
			this.z /= x;
		} else {
			this.x /= x;
			this.y /= y ?? 0;
			this.z /= z ?? 0;
		}
		return this;
	}
	/**
     * @param {number|Vector3} x 
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector3}
     */
	added(x, y, z) {
		if(x instanceof Object) {
			return new Vector3(
				this.x + x.x,
				this.y + x.y,
				this.z + x.z
			);
		} else if(y == undefined) {
			return new Vector3(
				this.x + x,
				this.y + x,
				this.z + x
			);
		} else {
			return new Vector3(
				this.x + x,
				this.y + (y ?? 0),
				this.z + (z ?? 0)
			);
		}
	}
	/**
     * @param {number|Vector3} x 
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector3}
     */
	subed(x, y, z) {
		if(x instanceof Object) {
			return new Vector3(
				this.x - x.x,
				this.y - x.y,
				this.z - x.z
			);
		} else if(y == undefined) {
			return new Vector3(
				this.x - x,
				this.y - x,
				this.z - x
			);
		} else {
			return new Vector3(
				this.x - x,
				this.y - (y ?? 0),
				this.z - (z ?? 0)
			);
		}
	}
	/**
     * @param {number|Vector3} x 
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector3}
     */
	muled(x, y, z) {
		if(x instanceof Object) {
			return new Vector3(
				this.x * x.x,
				this.y * x.y,
				this.z * x.z
			);
		} else if(y == undefined) {
			return new Vector3(
				this.x * x,
				this.y * x,
				this.z * x
			);
		} else {
			return new Vector3(
				this.x * x,
				this.y * (y ?? 0),
				this.z * (z ?? 0)
			);
		}
	}
	/**
     * @param {number|Vector3} x 
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector3}
     */
	dived(x, y, z) {
		if(x instanceof Object) {
			return new Vector3(
				this.x / x.x,
				this.y / x.y,
				this.z / x.z
			);
		} else if(y == undefined) {
			return new Vector3(
				this.x / x,
				this.y / x,
				this.z / x
			);
		} else {
			return new Vector3(
				this.x / x,
				this.y / (y ?? 0),
				this.z / (z ?? 0)
			);
		}
	}
	negate() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		return this;
	}
	negated() {
		return new Vector3(
			-this.x,
			-this.y,
			-this.z
		);
	}
	/**
     * Faster
     * @param {number} x 
     * @returns {this}
     */
	mulScalar(x) {
		this.x *= x;
		this.y *= x;
		this.z *= x;
		return this;
	}
	/**
     * Faster
     * @param {number} x 
     * @returns {Vector3}
     */
	muledScalar(x) {
		return new Vector3(
			this.x * x,
			this.y * x,
			this.z * x
		);
	}
	/**
     * Faster
     * @param {number} x 
     * @returns {this}
     */
	divScalar(x) {
		this.x /= x;
		this.y /= x;
		this.z /= x;
		return this;
	}
	/**@param {Vector3} target */
	dot(target) {
		return (
			(this.x * target.x) +
			(this.y * target.y) +
			(this.z * target.z)
		);
	}
	/**
     * @param {Vector3} target 
     * @returns {this}
    */
	cross(target) {
		this.x = this.y * target.z - this.z * target.y;
		this.y = this.z * target.x - this.x * target.z;
		this.z = this.x * target.y - this.y * target.x;
		return this;
	}
	/**
     * @param {Vector3} target 
     * @returns {Vector3}
    */
	crossed(target) {
		return new Vector3(
			this.y * target.z - this.z * target.y,
			this.z * target.x - this.x * target.z,
			this.x * target.y - this.y * target.x
		);
	}
	normalize(length = 1) {
		const l = this.length() * length;
		this.x /= l;
		this.y /= l;
		this.z /= l;
		return this;
	}
	normalized(length = 1) {
		const l = this.length() * length;
		return new Vector3(
			this.x / l,
			this.y / l,
			this.z / l
		);
	}
	length() {
		return Math.sqrt(
			this.x * this.x +
            this.y * this.y +
            this.z * this.z
		);
	}
	lengthSq() {
		return (
			this.x * this.x +
            this.y * this.y +
            this.z * this.z
		);
	}
	/**
     * @param {Quaternion} target
     * @returns {this}
     */
	applyQuaternion(target) {

		// quaternion q is assumed to have unit length

		const vx = this.x, vy = this.y, vz = this.z;
		const qx = target.x, qy = target.y, qz = target.z, qw = target.w;

		// t = 2 * cross( q.xyz, v );
		const tx = 2 * ( qy * vz - qz * vy );
		const ty = 2 * ( qz * vx - qx * vz );
		const tz = 2 * ( qx * vy - qy * vx );

		// v + q.w * t + cross( q.xyz, t );
		this.x = vx + qw * tx + qy * tz - qz * ty;
		this.y = vy + qw * ty + qz * tx - qx * tz;
		this.z = vz + qw * tz + qx * ty - qy * tx;

		return this;
	}
	
	/**@param {Vector3} target */
	distanceTo(target) {
		return Math.sqrt(
			((target.x - this.x)*(target.x - this.x)) +
            ((target.y - this.y)*(target.y - this.y)) +
            ((target.z - this.z)*(target.z - this.z))
		);
	}
	/**@param {Vector3} target */
	distanceToSq(target) {
		return (
			((target.x - this.x)*(target.x - this.x)) +
            ((target.y - this.y)*(target.y - this.y)) +
            ((target.z - this.z)*(target.z - this.z))
		);
	}
	toArray() {
		return [this.x,this.y,this.z];
	}
	clone() {
		return new Vector3(this.x, this.y, this.z);
	}
	/**
     * @param {*} target 
     * @returns {this}
     */
	copy(target) {
		this.x = target.x;
		this.y = target.y;
		this.z = target.z;
		return this;
	}
	/**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
	set(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * @param {Vector3} target 
	 * @returns {boolean}
	 */
	equals(target) {
		return (
			this.x === target.x &&
			this.y === target.y &&
			this.z === target.z
		);
	}

	/**
	 * @returns {boolean}
	 */
	isZero() {
		return (
			this.x === 0 &&
			this.y === 0 &&
			this.z === 0
		);
	}
}