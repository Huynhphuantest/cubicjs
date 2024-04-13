// eslint-disable-next-line
import { Vector3 } from "../../Cubic";

/**
 * 
 * @param {Vector3[]} vertices 
 * @param {Vector3} point
 * @param {Vector3} normal 
 * @returns {boolean}
 */
export function projectedPointInPolygon(vertices, point, normal) {
    let positiveResult = null;
    for(let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];

        // Get edge to the next vertex
        const edge = vertices[(i+1) % (vertices.length)].subed(vertex);

        // Get cross product between polygon normal and the edge
        const edgeXNormal = edge.crossed(normal);

        // Get vector between point and current vertex
        const vertexToPoint = point.subed(vertex);

        // This dot product determines which side of the edge the point is
        const r = edgeXNormal.dot(vertexToPoint);

        // If all such dot products have same sign, we are inside the polygon.
        if(
            (positiveResult === null) || 
            (r>0 && positiveResult === true) || 
            (r<=0 && positiveResult === false)
        ) {

            if(positiveResult === null){
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