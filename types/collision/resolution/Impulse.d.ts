export namespace Impulse {
    /**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
    function resolve(objA: Body, objB: Body, info: CollisionInfo): void;
    /**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
    function penetrationResolution(objA: Body, objB: Body, info: CollisionInfo): void;
    /**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
    function applyImpulse(objA: Body, objB: Body, info: CollisionInfo): void;
}
import { Body } from '../../Cubic.js';
import { CollisionInfo } from '../CollisionInfo.js';
