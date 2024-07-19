import { Vector3 } from './Vector3.js';
export class Edge {
	/**
	 * @param {Vector3} a
	 * @param {Vector3} b
	 * @param {number[]} [indices[]]
	 */
	constructor (a, b, indices = []) {
        this.a = a;
        this.b = b;
		this.indices = indices;
        this.direction = b.subed(a);
		this.length = this.direction.length();
		this.direction.normalize();
	}
}