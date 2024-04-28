'use strict';

// eslint-disable-next-line no-unused-vars

class AABB {
	/**
     * @param {Vector3} lowerBound
     * @param {Vector3} upperBound
     */
	constructor (lowerBound, upperBound) {
		this.lowerBound = lowerBound;
		this.upperBound = upperBound;
	}

	/**
     * @param {AABB} aabb
     */
	extend (aabb) {
		this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x);
		this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x);
		this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y);
		this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y);
		this.lowerBound.z = Math.min(this.lowerBound.z, aabb.lowerBound.z);
		this.upperBound.z = Math.max(this.upperBound.z, aabb.upperBound.z);
	}

	/**
     * @param {AABB} aabb
     * @returns
     */
	overlaps (aabb) {
		const
			l1 = this.lowerBound;
		const u1 = this.upperBound;
		const l2 = aabb.lowerBound;
		const u2 = aabb.upperBound;

		//      l2        u2
		//      |---------|
		// |--------|
		// l1       u1

		const overlapsX = ((l2.x <= u1.x && u1.x <= u2.x) || (l1.x <= u2.x && u2.x <= u1.x));
		const overlapsY = ((l2.y <= u1.y && u1.y <= u2.y) || (l1.y <= u2.y && u2.y <= u1.y));
		const overlapsZ = ((l2.z <= u1.z && u1.z <= u2.z) || (l1.z <= u2.z && u2.z <= u1.z));

		return overlapsX && overlapsY && overlapsZ;
	}

	/**
     * @param {AABB} aabb
     * @returns
     */
	contains (aabb) {
		const
			l1 = this.lowerBound;
		const u1 = this.upperBound;
		const l2 = aabb.lowerBound;
		const u2 = aabb.upperBound;

		//      l2        u2
		//      |---------|
		// |---------------|
		// l1              u1

		return (
			(l1.x <= l2.x && u1.x >= u2.x) &&
            (l1.y <= l2.y && u1.y >= u2.y) &&
            (l1.z <= l2.z && u1.z >= u2.z)
		);
	}

	/**
     * @returns {AABB}
     */
	clone () {
		return new AABB(
			this.lowerBound.clone(),
			this.upperBound.clone()
		);
	}
}

/**
 * @readonly
 * @enum {number}
 */
const ShapeType = {
	Box: 1,
	Sphere: 2,
	Plane: 4,
	Cylinder: 8,
	ConvexPolygon: 16,
	Trimesh: 32
};

class Shape {
	/**
     * @param {object} params
     * @param {ShapeType} params.type
     */
	constructor ({
		type
	}) {
		this.type = type;
		this.parameters = {};
		this.AABB = new AABB(new Vector3(), new Vector3());
	}

	/** @abstract */
	updateBoundingSphereRadius () {
		throw new Error('Not implemented');
	}

	/** @abstract */
	updateAABB () {
		throw new Error('Not implemented');
	}
	/**
	 * @abstract
	 * @param {number} mass
	 * @returns {Vector3}
	 */
	// eslint-disable-next-line
	calculateInertia(mass) {
		throw new Error('Not Implemented');
	}
}

// EXTENDED MATH :P

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns
 */
function clamp (value, min, max) {
	return Math.max(min, Math.min(max, value));
}

// eslint-disable-next-line no-unused-vars

// ThreeJS Quaternion :P
class Quaternion {
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
		return 2 * Math.acos(Math.abs(clamp(this.dot(target), -1, 1)));
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

// eslint-disable-next-line no-unused-vars

class Vector3 {
	/**
     * @constructor
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [z]
     */
	constructor (x, y, z) {
		/** @readonly */
		this.isVector = true;
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
	add (x, y, z) {
		if (x instanceof Object) {
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
	sub (x, y, z) {
		if (x instanceof Object) {
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
	mul (x, y, z) {
		if (x instanceof Object) {
			this.x *= x.x;
			this.y *= x.y;
			this.z *= x.z;
		} else if (y == undefined) {
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
	div (x, y, z) {
		if (x instanceof Object) {
			this.x /= x.x;
			this.y /= x.y;
			this.z /= x.z;
		} else if (y == undefined) {
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
	added (x, y, z) {
		if (x instanceof Object) {
			return new Vector3(
				this.x + x.x,
				this.y + x.y,
				this.z + x.z
			);
		} else if (y == undefined) {
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
	subed (x, y, z) {
		if (x instanceof Object) {
			return new Vector3(
				this.x - x.x,
				this.y - x.y,
				this.z - x.z
			);
		} else if (y == undefined) {
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
	muled (x, y, z) {
		if (x instanceof Object) {
			return new Vector3(
				this.x * x.x,
				this.y * x.y,
				this.z * x.z
			);
		} else if (y == undefined) {
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
	dived (x, y, z) {
		if (x instanceof Object) {
			return new Vector3(
				this.x / x.x,
				this.y / x.y,
				this.z / x.z
			);
		} else if (y == undefined) {
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

	negate () {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		return this;
	}

	negated () {
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
	mulScalar (x) {
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
	muledScalar (x) {
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
	divScalar (x) {
		this.x /= x;
		this.y /= x;
		this.z /= x;
		return this;
	}

	/**
	 * @param {Vector3} target
	 * @param {number} t
	 * @returns
	 */
	lerp (target, t) {
		const x = this.x + (target.x - this.x) * t;
		const y = this.y + (target.y - this.y) * t;
		const z = this.z + (target.z - this.z) * t;

		return new Vector3(x, y, z);
	}

	/** @param {Vector3} target */
	dot (target) {
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
	cross (target) {
		this.x = this.y * target.z - this.z * target.y;
		this.y = this.z * target.x - this.x * target.z;
		this.z = this.x * target.y - this.y * target.x;
		return this;
	}

	/**
     * @param {Vector3} target
     * @returns {Vector3}
    */
	crossed (target) {
		return new Vector3(
			this.y * target.z - this.z * target.y,
			this.z * target.x - this.x * target.z,
			this.x * target.y - this.y * target.x
		);
	}

	normalize (length = 1) {
		const l = this.length() * length;
		this.x /= l;
		this.y /= l;
		this.z /= l;
		return this;
	}

	normalized (length = 1) {
		const l = this.length() * length;
		return new Vector3(
			this.x / l,
			this.y / l,
			this.z / l
		);
	}

	length () {
		return Math.sqrt(
			this.x * this.x +
            this.y * this.y +
            this.z * this.z
		);
	}

	lengthSq () {
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
	applyQuaternion (target) {
		// quaternion q is assumed to have unit length

		const vx = this.x; const vy = this.y; const vz = this.z;
		const qx = target.x; const qy = target.y; const qz = target.z; const qw = target.w;

		// t = 2 * cross( q.xyz, v );
		const tx = 2 * (qy * vz - qz * vy);
		const ty = 2 * (qz * vx - qx * vz);
		const tz = 2 * (qx * vy - qy * vx);

		// v + q.w * t + cross( q.xyz, t );
		this.x = vx + qw * tx + qy * tz - qz * ty;
		this.y = vy + qw * ty + qz * tx - qx * tz;
		this.z = vz + qw * tz + qx * ty - qy * tx;

		return this;
	}

	/** @param {Vector3} target */
	distanceTo (target) {
		return Math.sqrt(
			((target.x - this.x) * (target.x - this.x)) +
            ((target.y - this.y) * (target.y - this.y)) +
            ((target.z - this.z) * (target.z - this.z))
		);
	}

	/** @param {Vector3} target */
	distanceToSq (target) {
		return (
			((target.x - this.x) * (target.x - this.x)) +
            ((target.y - this.y) * (target.y - this.y)) +
            ((target.z - this.z) * (target.z - this.z))
		);
	}

	toArray () {
		return [this.x, this.y, this.z];
	}

	clone () {
		return new Vector3(this.x, this.y, this.z);
	}

	/**
     * @param {*} target
     * @returns {this}
     */
	copy (target) {
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
	set (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * @param {Vector3} target
	 * @returns {boolean}
	 */
	equals (target) {
		return (
			this.x === target.x &&
			this.y === target.y &&
			this.z === target.z
		);
	}

	/**
	 * @returns {boolean}
	 */
	isZero () {
		return (
			this.x === 0 &&
			this.y === 0 &&
			this.z === 0
		);
	}
}

class Face {
	/**
	 * @param {Vector3[]} vertices
	 * @param {Vector3} [normal]
	 */
	constructor (vertices, normal) {
		this.vertices = vertices;
		this.normal = normal !== undefined
			? normal
			: computeNormal(vertices);
	}
}
/**
 * Compute normal vector from vertices of a face of a Convex Polyhedron
 * @param {Vector3[]} vertices
 */
function computeNormal (vertices) {
	const normal = new Vector3();

	for (let i = 0; i < vertices.length; i++) {
		const current = vertices[i];
		const next = vertices[(i + 1) % vertices.length];

		normal.add(
			(current.y - next.y) * (current.z + next.z),
			(current.z - next.z) * (current.x + next.x),
			(current.z - next.z) * (current.y + next.y)
		);
	}

	return normal.normalize();
}

class ConvexPolygon extends Shape {
	/**
     * @constructor
     * @param {object} params
     * @param {number} [params.type]
     * @param {Vector3[]} params.vertices
     * @param {Face[]} params.faces
     * @param {Vector3[]} params.axes
     */
	constructor ({
		type = ShapeType.ConvexPolygon,
		vertices,
		faces,
		axes
	}) {
		super({ type });
		this.type = type;
		this.vertices = vertices;
		this.faces = faces;
		this.axes = axes;
		this.needVerticesUpdate = false;
	}

	//     ULITIES

	/**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
	getFurthestVertex () {
		let furthestVertex;
		let furthestDistance = -Infinity;
		for (const vertex of this.vertices) {
			const distance = vertex.length();
			if (distance > furthestDistance) {
				furthestDistance = distance;
				furthestVertex = vertex;
			}
		}
		if (furthestVertex === undefined) throw new Error('This ConvexPolygons does not contain any vertex');
		return furthestVertex.clone();
	}

	/**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
	getNearestVertex () {
		let nearestVertex;
		let nearestDistance = Infinity;
		for (const vertex of this.vertices) {
			const distance = vertex.length();
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestVertex = vertex;
			}
		}
		if (nearestVertex === undefined) throw new Error('This ConvexPolygons does not contain any vertex');
		return nearestVertex.clone();
	}

	/**
     * This method is used for GJK
     * @param {Vector3} direction
     * @returns {Vector3}
     */
	getFurthestVertexInDirection (direction) {
		let furthestVertex;
		let furthestDistance = -Infinity;
		for (const vertex of this.vertices) {
			const distance = vertex.dot(direction);
			if (distance > furthestDistance) {
				furthestDistance = distance;
				furthestVertex = vertex;
			}
		}
		if (furthestVertex === undefined) throw new Error('This ConvexPolygon does not contain any vertex');
		return furthestVertex.clone();
	}

	updateBoundingSphereRadius () {
		this.boundingSphereRadius = this.getFurthestVertex().length();
	}

	updateAABB () {
		let
			minX = Infinity;
		let minY = Infinity;
		let minZ = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		let maxZ = -Infinity;
		for (const vertex of this.vertices) {
			if (vertex.x < minX) minX = vertex.x;
			else if (vertex.x > maxX) maxX = vertex.x;

			if (vertex.y < minY) minY = vertex.y;
			else if (vertex.y > maxY) maxY = vertex.y;

			if (vertex.z < minZ) minZ = vertex.z;
			else if (vertex.z > maxZ) maxZ = vertex.z;
		}

		this.AABB = new AABB(
			new Vector3(minX, minY, minZ),
			new Vector3(maxX, maxY, maxZ)
		);
	}
}

/**
 * @private
 * @typedef boxShape
 * @property {Vector3[]} vertices
 * @property {Face[]} faces
 * @property {Vector3[]} axes
 */
/**
 * @private
 * @param {number} w
 * @param {number} h
 * @param {number} d
 * @returns {boxShape}
 */
function buildShape (w, h, d) {
	/** @type {Vector3[]} */
	const vertices = [
		new Vector3(-w, -h, -d), // 0
		new Vector3(w, -h, -d), // 1
		new Vector3(w, h, -d), // 2
		new Vector3(-w, h, -d), // 3
		new Vector3(-w, -h, d), // 4
		new Vector3(w, -h, d), // 5
		new Vector3(w, h, d), // 6
		new Vector3(-w, h, d) // 7
	];

	/** @type {Face[]} */
	const faces = [
		new Face([vertices[3], vertices[2], vertices[1], vertices[0]], new Vector3(0, 0, -1)),
		new Face([vertices[4], vertices[5], vertices[6], vertices[7]], new Vector3(0, 0, 1)),
		new Face([vertices[5], vertices[4], vertices[0], vertices[1]], new Vector3(0, -1, 0)),
		new Face([vertices[2], vertices[3], vertices[7], vertices[6]], new Vector3(0, 1, 0)),
		new Face([vertices[0], vertices[4], vertices[7], vertices[3]], new Vector3(-1, 0, 0)),
		new Face([vertices[1], vertices[2], vertices[6], vertices[5]], new Vector3(1, 0, 0))
	];

	/** @type {Vector3[]} */
	const axes = [
		new Vector3(0, 0, 1),
		new Vector3(0, 1, 0),
		new Vector3(1, 0, 0)
	];

	return {
		vertices,
		faces,
		axes
	};
}

class Box extends ConvexPolygon {
	/**
     * @constructor
     * @param {number|Vector3} width
     * @param {number} [height]
     * @param {number} [depth]
     */
	constructor (width, height, depth) {
		let
			/** @type {number} */
			w,
			/** @type {number} */
			h,
			/** @type {number} */
			d;
		if (width instanceof Vector3) {
			w = width.x;
			h = width.y;
			d = width.z;
		} else if (height == undefined) {
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
			axes
		} = buildShape(
			w / 2,
			h / 2,
			d / 2
		);
		super({
			type: ShapeType.Box,
			vertices,
			faces,
			axes
		});

		this.parameters = {
			width: w,
			height: h,
			depth: d
		};

		this.updateBoundingSphereRadius();
		this.updateAABB();
	}

	updateBoundingSphereRadius () {
		this.boundingSphereRadius = Math.sqrt(
			this.parameters.width * this.parameters.width +
            this.parameters.height * this.parameters.height +
            this.parameters.depth * this.parameters.depth
		);
	}

	updateAABB () {
		this.AABB = new AABB(
			new Vector3(
				-this.parameters.width / 2,
				-this.parameters.height / 2,
				-this.parameters.depth / 2
			),
			new Vector3(
				this.parameters.width / 2,
				this.parameters.height / 2,
				this.parameters.depth / 2
			)
		);
	}

	/**
	 * @param {number} mass
	 * @returns {Vector3}
	 */
	calculateInertia (mass) {
		const x = this.parameters.width;
		const y = this.parameters.height;
		const z = this.parameters.depth;
		return new Vector3(
			1.0 / (12.0 * mass * (2 * x * 2 * y + 2 * z * 2 * z)),
			1.0 / (12.0 * mass * (2 * x * 2 * x + 2 * z * 2 * z)),
			1.0 / (12.0 * mass * (2 * y * 2 * y + 2 * x * 2 * x))
		);
	}
}

class Sphere extends Shape {
	/**
     * @constructor
     * @param {number} radius
     */
	constructor (radius = 0) {
		super({ type: ShapeType.Sphere });
		this.params = {
			radius
		};
		this.radius = radius;
		this.updateBoundingSphereRadius();
		this.updateAABB();
	}

	updateAABB () {
		const lengthVec = new Vector3(1, 0, 0).normalize().mulScalar(this.radius);
		this.AABB = new AABB(
			lengthVec.negated(),
			lengthVec
		);
	}

	/** */
	updateBoundingSphereRadius () {
		this.boundingSphereRadius = this.radius;
	}

	/**
	 * @param {number} mass
	 * @returns {Vector3}
	 */
	calculateInertia (mass) {
		const I = 2.0 / 5.0 * mass * this.radius * this.radius;
		return new Vector3(I, I, I);
	}
}

// eslint-disable-next-line no-unused-vars

class CollisionInfo {
	/**
     * @constructor
     * @param {object} params
     * @param {Vector3[]} params.points
     * @param {Vector3} params.normal
     * @param {number} params.penetration
     */
	constructor ({ points, normal, penetration }) {
		this.points = points;
		this.normal = normal;
		this.penetration = penetration;
	}
}

// eslint-disable-next-line no-unused-vars

const Impulse = {
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
	resolve (objA, objB, info) {
		//this.penetrationResolution(objA, objB, info);
		this.applyImpulse(objA, objB, info);
	},
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
	penetrationResolution (objA, objB, info) {
		const penetrationVector = info.normal.muledScalar(info.penetration);
		const totalMass = objA.mass + objB.mass;
		objA.position.add(
			penetrationVector.muledScalar(-objA.mass / totalMass)
		);
		objB.position.add(
			penetrationVector.muledScalar(objB.mass / totalMass)
		);
	},
	/**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
	applyImpulse (objA, objB, info) {
		/**
		 * @typedef Contact
		 * @property {number} impulse
		 * @property {Vector3} normal
		 * @property {Vector3} ra
		 * @property {Vector3} rb
		 */
		/** @type {Contact[]} */
		const contacts = [];
		for (const contact of info.points) {
			const N = info.normal;

			const
				ra = contact.subed(objA.position),
				rb = contact.subed(objB.position);
			// Perpendicular vector
			const unitVec = new Vector3(0,0,1);
			const raPerp = ra.crossed(unitVec);
			const rbPerp = rb.crossed(unitVec);
			if (raPerp.lengthSq() === 0) raPerp.set(0, 0, 1);
			if (rbPerp.lengthSq() === 0) rbPerp.set(0, 0, 1);

			const e = objA.material.restitution * objB.material.restitution;

			const Vr =
				(
					objA.velocity.added(raPerp.muled(objA.angularVelocity))
				)
					.sub(
				    objB.velocity.added(rbPerp.muled(objB.angularVelocity))
					);

			const contactMag = Vr.dot(N);
			// Collision already resolved
			// if(contactMag >= 0) continue;
			// Total velocity of collision (j is the impulse)
			const Vj = contactMag * (-(1 + e));

			const raPerpDotN = raPerp.dot(N);
			const rbPerpDotN = rbPerp.dot(N);

			const denom =
				(objA.invMass + objB.invMass) +
				(raPerpDotN * raPerpDotN) * objA.invInertiaScalar +
				(rbPerpDotN * rbPerpDotN) * objB.invInertiaScalar;
			const j = Vj / denom;
			contacts.push({
				impulse: j / info.points.length,
				normal: N,
				ra,
				rb
			});
		}

		for (const contact of contacts) {
			if (objA.mass !== 0) {
				objA.velocity.add(
					contact.normal.muledScalar(
						objA.invMass * contact.impulse
					)
				);
				objA.angularVelocity.add(
					contact.ra.crossed(contact.normal.muledScalar(contact.impulse)).mulScalar(
						objA.invInertiaScalar
					)
				);
			}

			if (objB.mass !== 0) {
				objB.velocity.sub(
					contact.normal.muledScalar(
						objB.invMass * contact.impulse
					)
				);
				objB.angularVelocity.sub(
					contact.rb.crossed(contact.normal.muledScalar(contact.impulse)).mulScalar(
						objB.invInertiaScalar
					)
				);
			}
		}
	}
};

class Mat3 {
	/**
     * @constructor
     * @param {number} [m11=1]
     * @param {number} [m12=0]
     * @param {number} [m13=0]
     * @param {number} [m21=0]
     * @param {number} [m22=1]
     * @param {number} [m23=0]
     * @param {number} [m31=0]
     * @param {number} [m32=0]
     * @param {number} [m33=1]
     */
	constructor (
		m11 = 1, m12 = 0, m13 = 0,
		m21 = 0, m22 = 1, m23 = 0,
		m31 = 0, m32 = 0, m33 = 1
	) {
		/**
         * The elements of the 3x3 matrix.
         * @type {Array<number>}
         */
		this.elements = [
			m11, m12, m13,
			m21, m22, m23,
			m31, m32, m33
		];
	}

	/**
     * Get the element at the specified row and column.
     *
     * @param {number} row - The row index (0, 1, or 2).
     * @param {number} col - The column index (0, 1, or 2).
     * @returns {number} The element at the specified row and column.
     */
	get (row, col) {
		return this.elements[row * 3 + col];
	}

	/**
     * Set the element at the specified row and column.
     *
     * @param {number} row - The row index (0, 1, or 2).
     * @param {number} col - The column index (0, 1, or 2).
     * @param {number} value - The value to set.
     */
	set (row, col, value) {
		this.elements[row * 3 + col] = value;
	}

	/**
     * Multiply this matrix by another matrix.
     *
     * @param {Mat3} matrix - The matrix to multiply by.
     * @returns {Mat3} The resulting matrix.
     */
	mul (matrix) {
		const result = new Mat3();

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				let sum = 0;
				for (let k = 0; k < 3; k++) {
					sum += this.get(i, k) * matrix.get(k, j);
				}
				result.set(i, j, sum);
			}
		}

		return result;
	}

	/**
     * Scalar multiplication of the matrix.
     *
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Mat3} The resulting matrix.
     */
	mulScalar (scalar) {
		const result = new Mat3();

		for (let i = 0; i < 9; i++) {
			result.elements[i] = this.elements[i] * scalar;
		}

		return result;
	}

	// Additional matrix operations can be added here
}

/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

class EventDispatcher {
	/**
     * @param {string} type 
     * @param {Function} listener
     */
	addEventListener( type, listener ) {
		if ( this.listeners === undefined )
		/**@type {Map<string, Function[]>} */
			this.listeners = new Map();
		/**@type {Function[] | undefined} */
		let listenersArr = this.listeners.get(type);
		if ( listenersArr === undefined ) {
			listenersArr = [];
			this.listeners.set(type, listenersArr);
		}

		if (listenersArr.indexOf( listener ) === - 1 ) {
			listenersArr.push( listener );
		}
	}

	/**
     * @param {string} type 
     * @param {Function} listener
     */
	hasEventListener( type, listener ) {
		if ( this.listeners === undefined )
			return false;
		const listenersArr = this.listeners.get(type);
		if ( listenersArr === undefined)
			return false;
		if ( listenersArr.indexOf( listener )  !== - 1)
			return false;
	}

	/**
     * @param {string} type 
     * @param {Function} listener
     */
	removeEventListener( type, listener ) {

		if ( this.listeners === undefined ) return;

		const listenersArr = this.listeners.get(type);

		if ( listenersArr !== undefined ) {
			const index = listenersArr.indexOf( listener );
			if ( index !== - 1 ) {
				listenersArr.splice( index, 1 );
			}
		}

	}

	/**
     * @param {EventType} event
     */
	dispatchEvent( event ) {
		if ( this.listeners === undefined ) return;
		const listeners = this.listeners;
		const listenerArray = listeners.get(event.type);
		if ( listenerArray !== undefined ) {
			event.target = this;
			// Make a copy, in case listeners are removed while iterating.
			const array = listenerArray.slice( 0 );
			for ( let i = 0, l = array.length; i < l; i ++ ) {
				array[ i ].call( this, event );
			}
			event.target = null;
		}
	}

}

class EventType {
	/**
     * @param {string} type
     * @param {*} [params]
     */
	constructor(type, params = {}) {
		this.type = type;
		this.params = params;
		/**@type {*} */
		this.target;
	}
}

// eslint-disable-next-line no-unused-vars

/**
 * @readonly
 * @enum {number}
 */
const BodyType = {
	DYNAMIC: 0,
	STATIC: 1
};

class Body extends EventDispatcher {
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
		this.invMass = this.mass === 0 ? 0 : 1 / this.mass;
		const I = this.inertia;
		I.set(0,0,0);
		const iI = this.invInertia;
		this.shapes.forEach((shape) => {
			I.add(shape.calculateInertia(this.mass));
		});
		iI.set(
			I.x === 0 ? 0 : 1.0 / I.x,
			I.y === 0 ? 0 : 1.0 / I.y,
			I.z === 0 ? 0 : 1.0 / I.z
		);
		this.inertiaScalar = I.x + I.y + I.z;
		this.invInertiaScalar = iI.x + iI.y + iI.z;
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

// eslint-disable-next-line no-unused-vars

/**
 * @typedef {import('./BroadPhase.js').BroadPhase} BroadPhase
 */
/**
 * @typedef {import('./BroadPhase.js').PotentialCollisionPair} PotentialCollisionPair
 */

/**
 * @type {BroadPhase}
 */
const SAP = {
	/**
     * @param {Body[]} objects
     * @returns {PotentialCollisionPair[]}
     */
	getPotentialCollision (objects) {
		/** @type {Body[]} */
		const axisList = objects.sort((a, b) => {
			if (a.worldInfo.AABB.lowerBound.x < b.worldInfo.AABB.lowerBound.x) {
				return -1;
			}
			if (a.worldInfo.AABB.lowerBound.x > b.worldInfo.AABB.lowerBound.x) {
				return 1;
			}
			return 0;
		});
		const pairs = [];

		// loop through all objects:
		for (let i = 0; i < axisList.length; i++) {
			// For each object, iterate over all the subsequent objects in the list
			// and find out if there are overlaps on the x-axis:
			for (let j = i + 1; j < axisList.length; j++) {
				const a = axisList[i];
				const b = axisList[j];
				if (a.worldInfo.AABB.upperBound.x < b.worldInfo.AABB.lowerBound.x) {
					break;
				}
				// if there is an overlap, add A to B's list
				// and B to A's list of potential collisions.
				// [every object's list of collision candidates is
				// cleared before the next frame]

				// if(!a.worldInfo.AABB.overlaps(b.worldInfo.AABB)) continue;
				pairs.push({
					a,
					b
				});
			}
		}
		return pairs;
	}
};

/**
 * @typedef {import("./NarrowPhase.js").CollisionResult} CollisionResult
 */

/**
 * @typedef Projection
 * @property {number} min
 * @property {number} max
*/

const SAT = {
	/**
     * @param {ConvexPolygon} a
     * @param {ConvexPolygon} b
     * @param {Body} objA
     * @param {Body} objB
     * @returns {CollisionResult}
     */
	isColliding (a, b, objA, objB) {
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
		const worldAAxes = a.axes.map(v =>
			v.clone()
				.applyQuaternion(objA.quaternion)
		);
		const worldBAxes = b.axes.map(v =>
			v.clone()
				.applyQuaternion(objB.quaternion)
		);
		const resultA = this.separatingAxis(worldAAxes, worldAVertices, worldBVertices);
		const resultB = this.separatingAxis(worldBAxes, worldBVertices, worldAVertices);
		if (resultA !== null && resultB !== null) {
			let result;
			if (resultA.penetration < resultB.penetration) { result = resultA; } else { result = resultB; }

			return {
				info: new CollisionInfo({
					normal: result.axis,
					points: this.findContactPoints(worldAVertices, worldBVertices, worldAAxes, worldBAxes),
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
	 * @param {Vector3[]} axes
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
     * @returns {null | seperatingAxisResult}
     */
	separatingAxis (axes, worldAVertices, worldBVertices) {
		let minDepth = Infinity;
		const axisFound = new Vector3();
		for (const axis of axes) {
			const { min: minA, max: maxA } = this.project(worldAVertices, axis);
			const { min: minB, max: maxB } = this.project(worldBVertices, axis);

			const depth = this.calculatePenetrationDepth({
				min: minA,
				max: maxA
			}, {
				min: minB,
				max: maxB
			});

			if (Math.max(minA, minB) > Math.min(maxA, maxB)) {
				return null;
			}

			if (depth < 0) continue;
			if (depth < minDepth) {
				minDepth = depth;
				axisFound.copy(axis);
			}
		}
		if (minDepth === Infinity) return null;
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
	calculatePenetrationDepth (projectionA, projectionB) {
		return Math.min(projectionB.max - projectionA.min, projectionA.max - projectionB.min);
	},
	/**
     * @param {Vector3[]} vertices
     * @param {Vector3} axis
     * @returns {Projection}
     */
	project (vertices, axis) {
		let min = Infinity;
		let max = -Infinity;
		for (const v of vertices) {
			const dot = (
				v
			).dot(axis);

			if (dot < min) min = dot;
			if (dot > max) max = dot;
		}
		return {
			min,
			max
		};
	},

	/**
     * @param {Vector3[]} worldAVertices
     * @param {Vector3[]} worldBVertices
	 * @param {Vector3[]} axesA
	 * @param {Vector3[]} axesB
     * @returns {Vector3[]}
     */
	findContactPoints (worldAVertices, worldBVertices, axesA, axesB) {
		/** @type {Vector3[]} */
		const contactPoints = [];

		const allVerticesAOverlapB = this.filterVerticesIntersectingShape(worldAVertices, worldBVertices, axesB);
		contactPoints.push(...allVerticesAOverlapB);
		const allVerticesBOverlapA = this.filterVerticesIntersectingShape(worldBVertices, worldAVertices, axesA);
		contactPoints.push(...allVerticesBOverlapA);

		return contactPoints;
	},

	/**
     * @param {Vector3[]} worldAVertices
	 * @param {Vector3[]} worldBVertices
	 * @param {Vector3[]} axes
     * @returns {Vector3[]}
     */
	filterVerticesIntersectingShape (worldAVertices, worldBVertices, axes) {
		/** @type {Vector3[]} */
		let filtered = worldAVertices;
		for (const axis of axes) {
			/** @type {Vector3[]} */
			const filteredInAxis = [];
			const { min, max } = this.project(worldBVertices, axis);
			for (const vertex of filtered) {
				const projection = vertex.dot(axis);
				if (projection > min && projection < max) filteredInAxis.push(vertex);
			}
			filtered = filteredInAxis;
		}
		return filtered;
	},

	/**
     * @param {Vector3[]} vertices
     * @returns {Vector3}
     */
	getCenter (vertices) {
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

// eslint-disable-next-line

/**
 *
 * @param {Vector3[]} vertices
 * @param {Vector3} point
 * @param {Vector3} normal
 * @returns {boolean}
 */
function projectedPointInPolygon (vertices, point, normal) {
	let positiveResult = null;
	for (let i = 0; i < vertices.length; i++) {
		const vertex = vertices[i];

		// Get edge to the next vertex
		const edge = vertices[(i + 1) % (vertices.length)].subed(vertex);

		// Get cross product between polygon normal and the edge
		const edgeXNormal = edge.crossed(normal);

		// Get vector between point and current vertex
		const vertexToPoint = point.subed(vertex);

		// This dot product determines which side of the edge the point is
		const r = edgeXNormal.dot(vertexToPoint);

		// If all such dot products have same sign, we are inside the polygon.
		if (
			(positiveResult === null) ||
            (r > 0 && positiveResult) ||
            (r <= 0 && !positiveResult)
		) {
			if (positiveResult === null) {
				positiveResult = r > 0;
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
 * @typedef {import('../collision/detection/narrow/NarrowPhase.js').CollisionResult} CollisionResult
 */

class World {
	/**
     * @constructor
     * @param {object} config
     * @param {Vector3} [config.gravity] - This define the velocity added each step to all objects in world
     */
	constructor ({
		gravity = new Vector3()
	}) {
		/** @constant */
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
	step (deltaTime) {
		if (deltaTime == 0) return;
		// If delta time will it reverse time?
		this.bodys.forEach(body => {
			body.update(this, deltaTime);
			body.velocity.add(this.gravity.clone().mulScalar(deltaTime * body.mass));
		});

		// COLLISION CHECKING
		//   BROAD PHASE
		const pairs = SAP.getPotentialCollision(this.bodys);

		//   NARROW PHASE
		for (const pair of pairs) {
			// Use SAP again too get potential collision in each Body

			// if(!pair.a.worldInfo.AABB.overlaps(pair.b.worldInfo.AABB)) return;
			bodyBody(pair.a, pair.b);
		}
	}

	/**
     * @param {Body} body
     */
	add (body) {
		this.bodys.push(body);
	}
}

/**
 *
 * @param {Body} objA
 * @param {Body} objB
 */
function bodyBody (objA, objB) {
	if (objA.mass === 0 && objB.mass === 0) return;
	for (const shapeA of objA.shapes) {
		for (const shapeB of objB.shapes) {
			/**@type {CollisionInfo | null} */
			let info = null;
			let inverse = false;
			// CONVEX x CONVEX
			if (
				shapeA instanceof ConvexPolygon &&
                shapeB instanceof ConvexPolygon
			) {
				info = convexConvex(objA, objB, shapeA, shapeB);
			}

			// SPHERE x CONVEX
			else if (
				shapeA instanceof Sphere &&
                shapeB instanceof ConvexPolygon
			) {
				info = sphereConvex(objA, objB, shapeA, shapeB);
			}
			// CONVEX x SPHERE
			else if (
				shapeA instanceof ConvexPolygon &&
                shapeB instanceof Sphere
			) {
				inverse = true;
				info = sphereConvex(objB, objA, shapeB, shapeA);
			}

			// SPHERE x SPHERE
			else if (
				shapeA instanceof Sphere &&
                shapeB instanceof Sphere
			) {
				info = sphereSphere(objA, objB, shapeA, shapeB);
			}

			if(info !== null) {
				const collidedEvent = new EventType('collide');
				if(!inverse) {
					Impulse.resolve(objA, objB, info);
				}
				else {
					Impulse.resolve(objB, objA, info);
				}
				collidedEvent.params.info = info;
				collidedEvent.params.body = objB;
				objA.dispatchEvent(collidedEvent);
				collidedEvent.params.body = objA;
				objB.dispatchEvent(collidedEvent);
			}
		}
	}
}

/**
*
* @param {Body} objA
* @param {Body} objB
* @param {Sphere} shapeA
* @param {ConvexPolygon} shapeB
* @returns {CollisionInfo | null}
*/
function sphereConvex (objA, objB, shapeA, shapeB) {
	/**
     * @param {Vector3} corner
     * @returns {CollisionInfo | null}
     */
	function sphereCorner (corner) {
		const difference = corner.subed(objA.position);
		if (difference.lengthSq() < shapeA.radius * shapeA.radius) {
			const normal = difference.normalized();
			const overlap = difference.length();
			const info = new CollisionInfo({
				normal,
				points: [normal.muledScalar(-shapeA.radius).add(objA.position)],
				penetration: Math.max(overlap - shapeA.radius, 0)
			});
			return info;
		}
		return null;
	}

	/**
     * @typedef sphereEdgeResult
     * @property {Vector3} normal
     * @property {Vector3} point
     */
	/**
     * @param {Face} face
     * @returns {CollisionInfo | null}
     */
	function sphereFace (face) {
		const planeNormal = face.normal
			.clone()
			.applyQuaternion(objB.quaternion);

		const worldPoint = face.vertices[0]
			.clone()
			.applyQuaternion(objB.quaternion)
			.add(objB.position);

		const distance = Math.abs(
			worldPoint.dot(planeNormal) -
            objA.position.dot(planeNormal)
		);

		const penetration = distance - shapeA.radius;
		if (penetration > 0) return null;

		const worldFaceVertices = face.vertices.map(vertex =>
			vertex
				.clone()
				.applyQuaternion(objB.quaternion)
				.add(objB.position)
		);

		const sphereClosestPoint = objA.position.added(planeNormal.muledScalar(-shapeA.radius));

		if (!projectedPointInPolygon(worldFaceVertices, objA.position, planeNormal)) {
			// Check for edges

			for (let i = 0; i < worldFaceVertices.length; i++) {
				const vA = worldFaceVertices[(i) % worldFaceVertices.length];
				const vB = worldFaceVertices[(i + 1) % worldFaceVertices.length];
				return sphereEdge(vA, vB);
			}
		}

		// Create collision info object
		const info = new CollisionInfo({
			normal: planeNormal.clone(),
			points: [sphereClosestPoint],
			penetration
		});

		return info;
	}
	/**
     * @param {Vector3} vertexA - First vertex defining the edge.
     * @param {Vector3} vertexB - Second vertex defining the edge.
     * @returns {CollisionInfo | null} - Collision result if collision occurs, otherwise null.
     */
	function sphereEdge (vertexA, vertexB) {
		// Calculate vector from one edge vertex to the sphere center
		const edgeDirection = vertexB.subed(vertexA);
		const edgeToPoint = objA.position.subed(vertexA);

		// Calculate parameter t to find closest point on edge to sphere center
		const t = edgeToPoint.dot(edgeDirection) / edgeDirection.lengthSq();

		// Clamp t to the range [0, 1] to ensure closest point lies within edge segment
		const clampedT = Math.max(0, Math.min(t, 1));

		// Calculate closest point on edge to sphere center
		const closestPoint = vertexA.added(edgeDirection.muledScalar(clampedT));

		// Calculate distance between closest point and sphere center
		const distanceSq = closestPoint.distanceToSq(objA.position);
		const penetration = shapeA.radius - Math.sqrt(distanceSq);

		// Check if distance is less than or equal to sphere radius
		if (penetration < 0) return null;

		// Calculate collision normal
		const normal = closestPoint.subed(objA.position).normalize();

		// Calculate collision point
		const collisionPoint = objA.position.subed(normal.muledScalar(shapeA.radius - penetration));

		return new CollisionInfo({
			normal: normal.clone(),
			points: [collisionPoint],
			penetration
		});
	}

	for (const vertexLocal of shapeB.vertices) {
		const vertex = vertexLocal
			.clone()
			.applyQuaternion(objB.quaternion)
			.add(objB.position);
		const info = sphereCorner(vertex);
		if (info !== null) return info;
	}

	for (const face of shapeB.faces) {
		const info = sphereFace(face);
		if (info !== null) return info;
	}

	return null;
}

/**
 * @param {Body} objA
 * @param {Body} objB
 * @param {Sphere} shapeA
 * @param {Sphere} shapeB
 * @returns {CollisionInfo | null}
 */
function sphereSphere (objA, objB, shapeA, shapeB) {
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

/**
 * @param {Body} objA
 * @param {Body} objB
 * @param {ConvexPolygon} shapeA
 * @param {ConvexPolygon} shapeB
 * @returns {CollisionInfo | null}
 */
function convexConvex (objA, objB, shapeA, shapeB) {
	return SAT.isColliding(shapeA, shapeB, objA, objB).info;
}

const MATERIALS_RESTITUTION = {

};
class Material {
	/**
     * This define how rough / elastic / ... a surface of an shape should be
     * @param {object} params
     * @param {number} params.restitution
     */
	constructor ({ restitution = 1 }) {
		this.restitution = restitution;
	}
}

exports.AABB = AABB;
exports.Body = Body;
exports.Box = Box;
exports.ConvexPolygon = ConvexPolygon;
exports.Face = Face;
exports.Impulse = Impulse;
exports.MATERIALS_RESTITUTION = MATERIALS_RESTITUTION;
exports.Mat3 = Mat3;
exports.Material = Material;
exports.Quaternion = Quaternion;
exports.Shape = Shape;
exports.ShapeType = ShapeType;
exports.Sphere = Sphere;
exports.Vector3 = Vector3;
exports.World = World;
