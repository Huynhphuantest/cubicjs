/**
 * @typedef PotentialCollisionPair
 * @property {Body} a
 * @property {Body} b
 */
/**@abstract */
export class BroadPhase {
    /**
     * Return a list of potential collision.
     * @param {Body[]} objects
     * @returns {PotentialCollisionPair[]}
     */
    getPotentialCollision(objects: Body[]): PotentialCollisionPair[];
}
export type PotentialCollisionPair = {
    a: Body;
    b: Body;
};
import { Body } from "../../../Cubic.js";
