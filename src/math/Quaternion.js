// eslint-disable-next-line no-unused-vars
import { Vector3 } from './Vector3.js';
import * as EMath from './ExtendedMath.js';

// ThreeJS Quaternion :P
export class Quaternion {
	/**
   *
   * @param {number} [x]
   * @param {number} [y]
   * @param {number} [z]
   * @param {number} [w]
   */
	constructor (x = 0, y = 0, z = 0, w = 1) {
		/** @readonly */
		this.isQuaternion = true;

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	/**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {this}
   */
	set (x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;
	}

	/**
   * @returns {Quaternion}
   */
	clone () {
		return new Quaternion(this.x, this.y, this.z, this.w);
	}

	/**
   * @param {Quaternion} target
   * @returns {this}
   */
	copy (target) {
		this.x = target.x;
		this.y = target.y;
		this.z = target.z;
		this.w = target.w;

		return this;
	}

	/**
   * @param {Vector3} axis - Should be normalized
   * @param {number} angle
   * @returns
   */
	setFromAxisAngle (axis, angle) {
		const
			halfAngle = angle / 2;
		const s = Math.sin(halfAngle);

		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos(halfAngle);

		return this;
	}

	/**
   * @param {Vector3} from - Should be normalized
   * @param {Vector3} to - Should be normalized
   * @returns {this}
   */
	setFromVectors (from, to) {
		let r = from.dot(to) + 1;

		if (r < Number.EPSILON) {
			// vFrom and vTo point in opposite directions
			r = 0;
			if (Math.abs(from.x) > Math.abs(from.z)) {
				this.x = -from.y;
				this.y = from.x;
				this.z = 0;
				this.w = r;
			} else {
				this.x = 0;
				this.y = -from.z;
				this.z = from.y;
				this.w = r;
			}
		} else {
			// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
			this.x = from.y * to.z - from.z * to.y;
			this.y = from.z * to.x - from.x * to.z;
			this.z = from.x * to.y - from.y * to.x;
			this.w = r;
		}
		return this.normalize();
	}

	/**
   * @param {Quaternion} target
   * @returns {number}
   */
	angleTo (target) {
		return 2 * Math.acos(Math.abs(EMath.clamp(this.dot(target), -1, 1)));
	}

	/**
   * @param {Quaternion} target
   * @param {number} step
   * @returns {this}
   */
	rotateTowards (target, step) {
		const angle = this.angleTo(target);
		if (step === 1) return this.copy(target);
		if (angle === 0) return this;
		const t = Math.min(1, step / angle);
		this.slerp(target, t);
		return this;
	}

	/**
   * @returns {this}
   */
	identity () {
		return this.set(0, 0, 0, 1);
	}

	/**
   * @returns {this}
   */
	invert () {
		// quaternion is assumed to have unit length
		return this.conjugate();
	}

	/**
   * @returns {this}
   */
	conjugate () {
		this._x *= -1;
		this._y *= -1;
		this._z *= -1;
		return this;
	}

	/**
   * @param {Quaternion} target
   * @returns {number}
   */
	dot (target) {
		return (
			this.x * target.x +
      this.y * target.y +
      this.z * target.z +
      this.w * target.w
		);
	}

	/**
   * @returns {number}
   */
	lengthSq () {
		return (
			this.x * this.x +
      this.y * this.y +
      this.z * this.z +
      this.w * this.w
		);
	}

	/**
   * @returns {number}
   */
	length () {
		return Math.sqrt(
			this.x * this.x +
      this.y * this.y +
      this.z * this.z +
      this.w * this.w
		);
	}

	/**
   * @returns {this}
   */
	normalize () {
		let l = this.length();
		if (l === 0) {
			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;
		} else {
			l = 1 / l;
			this.x = this.x * l;
			this.y = this.y * l;
			this.z = this.z * l;
			this.w = this.w * l;
		}

		return this;
	}

	/**
   * @param {Quaternion} target
   * @returns {this}
   */
	multiply (target) {
		return this.mulQuaternion(target);
	}

	/**
   * @param {Quaternion} target
   * @returns {this}
   */
	mulQuaternion (target) {
		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		const qax = this.x; const qay = this.y; const qaz = this.z; const qaw = this.w;
		const qbx = target.x; const qby = target.y; const qbz = target.z; const qbw = target.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
		this.normalize();

		return this;
	}

	/**
   * @param {Quaternion} target
   * @param {number} step
   * @returns {this}
   */
	slerp (target, step) {
		if (step === 0) return this;
		if (step === 1) return this.copy(target);
		const x = this.x; const y = this.y; const z = this.z; const w = this.w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		let cosHalfTheta = w * target.w + x * target.x + y * target.y + z * target.z;

		if (cosHalfTheta < 0) {
			this.w = -target.w;
			this.x = -target.x;
			this.y = -target.y;
			this.z = -target.z;

			cosHalfTheta = -cosHalfTheta;
		} else {
			this.copy(target);
		}

		if (cosHalfTheta >= 1.0) {
			this.w = w;
			this.x = x;
			this.y = y;
			this.z = z;

			return this;
		}

		const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

		if (sqrSinHalfTheta <= Number.EPSILON) {
			const s = 1 - step;
			this._w = s * w + step * this.w;
			this._x = s * x + step * this.x;
			this._y = s * y + step * this.y;
			this._z = s * z + step * this.z;

			this.normalize();
			return this;
		}

		const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
		const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
		const ratioA = Math.sin((1 - step) * halfTheta) / sinHalfTheta;
		const ratioB = Math.sin(step * halfTheta) / sinHalfTheta;

		this._w = (w * ratioA + this._w * ratioB);
		this._x = (x * ratioA + this._x * ratioB);
		this._y = (y * ratioA + this._y * ratioB);
		this._z = (z * ratioA + this._z * ratioB);

		return this;
	}

	/**
   * @returns {this}
   */
	random () {
		const u1 = Math.random();
		const sqrt1u1 = Math.sqrt(1 - u1);
		const sqrtu1 = Math.sqrt(u1);

		const u2 = 2 * Math.PI * Math.random();

		const u3 = 2 * Math.PI * Math.random();

		return this.set(
			sqrt1u1 * Math.cos(u2),
			sqrtu1 * Math.sin(u3),
			sqrtu1 * Math.cos(u3),
			sqrt1u1 * Math.sin(u2)
		);
	}

	/**
   * @param {Quaternion} target
   * @returns
   */
	equals (target) {
		return (target.x === this.x) && (target.y === this.y) && (target.z === this.z) && (target.w === this.w);
	}
}
