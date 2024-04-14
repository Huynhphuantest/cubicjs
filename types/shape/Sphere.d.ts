export class Sphere extends Shape {
    /**
     * @constructor
     * @param {number} radius
     */
    constructor(radius?: number);
    params: {
        radius: number;
    };
    radius: number;
    boundingSphereRadius: number | undefined;
}
import { Shape } from "../core/Shape.js";
