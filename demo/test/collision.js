/* eslint-disable */
/*
    node test/collision.js
*/
//@ts-check
import * as CUBIC from "../../src/Cubic.js";
import GJK from "../../src/collision/detection/narrow/GJK.js";

const world = new CUBIC.World({
    gravity: new CUBIC.Vector3(0,-0.1,0)
});







const A = new CUBIC.Body({
    shapes: new CUBIC.Box(5,5,5),
    mass:1
});
const B = new CUBIC.Body({
    shapes: new CUBIC.Box(5,5,5),
    mass:5
});
world.add(A);
world.add(B);

B.position.set(0,0,0);
A.position.set(1,0,0);
A.velocity.set(1,0,0);

world.step(1)