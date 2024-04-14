export default Impulse;
declare const Impulse: ImpulseResponse;
declare class ImpulseResponse {
    /**
     * @param {Body} objA
     * @param {Body} objB
     * @param {CollisionInfo} info
     */
    resolve(objA: Body, objB: Body, info: CollisionInfo): void;
}
import { Body } from "../../Cubic.js";
import { CollisionInfo } from "../CollisionInfo.js";
