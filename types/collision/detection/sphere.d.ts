/**
*
* @param {Body} objA
* @param {Body} objB
* @param {Sphere} shapeA
* @param {ConvexPolygon} shapeB
* @returns {CollisionInfo | null}
*/
export function sphereConvex(objA: Body, objB: Body, shapeA: Sphere, shapeB: ConvexPolygon): CollisionInfo | null;
/**
 * @param {Body} objA
 * @param {Body} objB
 * @param {Sphere} shapeA
 * @param {Sphere} shapeB
 * @returns {CollisionInfo | null}
 */
export function sphereSphere(objA: Body, objB: Body, shapeA: Sphere, shapeB: Sphere): CollisionInfo | null;
import { Body } from '../../Cubic';
import { Sphere } from '../../Cubic';
import { ConvexPolygon } from '../../Cubic';
import { CollisionInfo } from '../CollisionInfo';
