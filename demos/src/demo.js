import { init } from "./utils/render.ts";
import { cubicShapeAdaptor } from "./utils/adaptor.ts";
import { MeshBuilder } from "./utils/utils.ts";
import * as THREE from "three";
import * as CUBIC from "../../src/Cubic.js";
import { Vector3 } from "../../";

const fixedDeltaTime = 1/60;
const objects = [];

const { animate, scene } = init();

const world = new CUBIC.World({
    gravity: new Vector3(0, -9.18, 0)
});


const groundSize = 50;
const Ground = new CUBIC.Body({
    shapes: new CUBIC.Box(groundSize,1,groundSize),
    mass: 0
});
add(Ground);
//Ground.position.set(groundSize/2, 0, groundSize/2);


const A = new CUBIC.Body({
    shapes: new CUBIC.Box(5,5,5),
    mass: 0.5
});
A.position.y = 1;
add(A, true);








function update(time) {
    requestAnimationFrame(update);

    
    world.step(fixedDeltaTime);
    for(const sync of objects) {
        sync.THREEObject.position.copy(sync.CUBICObject.position);
        sync.THREEObject.quaternion.copy(sync.CUBICObject.quaternion);
    }
    animate();
}
update(0);

function add(body, randomColor = false) {
    const object = new MeshBuilder(scene);
    for(const shape of body.shapes) {
        const geometry = cubicShapeAdaptor(shape);
        if(randomColor) geometry.material = new THREE.MeshStandardMaterial({
            color: Math.round(Math.random() * 255 * 255 * 255)
        });
        object.addShape(geometry);
    }
    object.setPosition(body.position.x, body.position.y, body.position.z);
    
    objects.push({
        THREEObject: object.build(),
        CUBICObject: body
    });
    
    world.add(body);
}