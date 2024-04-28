export class Quaternion {
    /**
   *
   * @param {number} [x]
   * @param {number} [y]
   * @param {number} [z]
   * @param {number} [w]
   */
    constructor(x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined);
    /** @readonly */
    readonly isQuaternion: boolean;
    x: number;
    y: number;
    z: number;
    w: number;
    /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {this}
   */
    set(x: number, y: number, z: number, w: number): this;
    /**
   * @returns {Quaternion}
   */
    clone(): Quaternion;
    /**
   * @param {Quaternion} target
   * @returns {this}
   */
    copy(target: Quaternion): this;
    /**
   * @param {Vector3} axis - Should be normalized
   * @param {number} angle
   * @returns
   */
    setFromAxisAngle(axis: Vector3, angle: number): this;
    /**
   * @param {Vector3} from - Should be normalized
   * @param {Vector3} to - Should be normalized
   * @returns {this}
   */
    setFromVectors(from: Vector3, to: Vector3): this;
    /**
   * @param {Quaternion} target
   * @returns {number}
   */
    angleTo(target: Quaternion): number;
    /**
   * @param {Quaternion} target
   * @param {number} step
   * @returns {this}
   */
    rotateTowards(target: Quaternion, step: number): this;
    /**
   * @returns {this}
   */
    identity(): this;
    /**
   * @returns {this}
   */
    invert(): this;
    /**
   * @returns {this}
   */
    conjugate(): this;
    /**
   * @param {Quaternion} target
   * @returns {number}
   */
    dot(target: Quaternion): number;
    /**
   * @returns {number}
   */
    lengthSq(): number;
    /**
   * @returns {number}
   */
    length(): number;
    /**
   * @returns {this}
   */
    normalize(): this;
    /**
   * @param {Quaternion} target
   * @returns {this}
   */
    multiply(target: Quaternion): this;
    /**
   * @param {Quaternion} target
   * @returns {this}
   */
    mulQuaternion(target: Quaternion): this;
    /**
   * @param {Quaternion} target
   * @param {number} step
   * @returns {this}
   */
    slerp(target: Quaternion, step: number): this;
    _w: any;
    _x: any;
    _y: any;
    _z: any;
    /**
   * @returns {this}
   */
    random(): this;
    /**
   * @param {Quaternion} target
   * @returns
   */
    equals(target: Quaternion): boolean;
}
import { Vector3 } from './Vector3.js';
