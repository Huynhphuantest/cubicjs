// CubicJS Adaptor to ThreeJS Geometry
import { ShapeCreator } from './utils';
//@ts-ignore
import { ShapeType as ShapeTypeEnum } from '../../../src/Cubic.js';
import type { Shape } from '../../../types/Cubic.d.ts';
import { Mesh } from 'three';

/**Convert CubicJS Shape Type to ThreeJS Geometry */
export function cubicShapeAdaptor(shape:Shape):Mesh {
    const params = shape.parameters;
    switch(shape.type) {
        case ShapeTypeEnum.Box:
            //@ts-ignore
            return ShapeCreator.createBox(params.width, params.height, params.depth);
        case ShapeTypeEnum.Sphere:
            //@ts-ignore
            return ShapeCreator.createSphere(params.radius);
        case ShapeTypeEnum.ConvexPolygon:
            //@ts-ignore
            return ShapeCreator.createConvexPolygon(shape);
    }
    throw new Error('Not a valid Cubic.ShapeType');
}