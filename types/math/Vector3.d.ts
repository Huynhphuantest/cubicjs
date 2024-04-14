export class Vector3 {
    /**
     * @constructor
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [z]
     */
    constructor(x?: number | undefined, y?: number | undefined, z?: number | undefined);
    /**@readonly */
    readonly isVector: boolean;
    x: number;
    y: number;
    z: number;
    /**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
    add(x: number | Vector3, y?: number | undefined, z?: number | undefined): this;
    /**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
    sub(x: number | Vector3, y?: number | undefined, z?: number | undefined): this;
    /**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
    mul(x: number | Vector3, y?: number | undefined, z?: number | undefined): this;
    /**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
    div(x: number | Vector3, y?: number | undefined, z?: number | undefined): this;
    /**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector3}
     */
    added(x: number | Vector3, y?: number | undefined, z?: number | undefined): Vector3;
    /**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector3}
     */
    subed(x: number | Vector3, y?: number | undefined, z?: number | undefined): Vector3;
    /**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector3}
     */
    muled(x: number | Vector3, y?: number | undefined, z?: number | undefined): Vector3;
    /**
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Vector3}
     */
    dived(x: number | Vector3, y?: number | undefined, z?: number | undefined): Vector3;
    negate(): this;
    negated(): Vector3;
    /**
     * Faster
     * @param {number} x
     * @returns {this}
     */
    mulScalar(x: number): this;
    /**
     * Faster
     * @param {number} x
     * @returns {Vector3}
     */
    muledScalar(x: number): Vector3;
    /**
     * Faster
     * @param {number} x
     * @returns {this}
     */
    divScalar(x: number): this;
    /**
     * @param {Vector3} target
     * @param {number} t
     * @returns
     */
    lerp(target: Vector3, t: number): Vector3;
    /**@param {Vector3} target */
    dot(target: Vector3): number;
    /**
     * @param {Vector3} target
     * @returns {this}
    */
    cross(target: Vector3): this;
    /**
     * @param {Vector3} target
     * @returns {Vector3}
    */
    crossed(target: Vector3): Vector3;
    normalize(length?: number): this;
    normalized(length?: number): Vector3;
    length(): number;
    lengthSq(): number;
    /**
     * @param {Quaternion} target
     * @returns {this}
     */
    applyQuaternion(target: Quaternion): this;
    /**@param {Vector3} target */
    distanceTo(target: Vector3): number;
    /**@param {Vector3} target */
    distanceToSq(target: Vector3): number;
    toArray(): number[];
    clone(): Vector3;
    /**
     * @param {*} target
     * @returns {this}
     */
    copy(target: any): this;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    set(x: number, y: number, z: number): void;
    /**
     * @param {Vector3} target
     * @returns {boolean}
     */
    equals(target: Vector3): boolean;
    /**
     * @returns {boolean}
     */
    isZero(): boolean;
}
import { Quaternion } from "./Quaternion.js";
