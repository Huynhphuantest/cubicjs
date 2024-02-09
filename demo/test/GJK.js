/* eslint-disable */
/*
    node test/GJK.js
*/
//@ts-check
import { MeshStandardMaterial } from "three";
import * as CUBIC from "../../src/Cubic.js";
import GJK from "../../src/collision/detection/narrow/GJK.js";

const world = new CUBIC.World({
    gravity: new CUBIC.Vector3(0,0,0)
});





const A = new CUBIC.Body({
    shapes: new CUBIC.Box(5,5,5),
    mass:1
});
const B = new CUBIC.Body({
    shapes: new CUBIC.Sphere(5),
    mass:10
});
world.add(A);
world.add(B);


world.step(0.1);
