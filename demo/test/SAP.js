/* eslint-disable */
/**
    node test/SAP.js
 */
import { Box, Sphere, World, Body } from "../../src/Cubic.js";

const world = new World({});
const a = new Body({
    shapes: new Sphere(5,5,5)
});
const b = new Body({
    shapes: new Sphere(5,5,5)
});
a.name = "A";
b.name = "B";
world.add(a);
world.add(b);

a.position.add(0,0,0);
world.step(0.1);
a.position.add(100,0,0);
world.step(0.1);
a.position.set(7,0,0);
world.step(0.1);
