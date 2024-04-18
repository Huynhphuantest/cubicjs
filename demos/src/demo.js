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
    mass: 0,
    material: new CUBIC.Material({
        restitution:0.9
    })
});
add(Ground);
//Ground.position.set(groundSize/2, 0, groundSize/2);


const Spinner = new CUBIC.Body({
    shapes: new CUBIC.Box(1, 10, groundSize),
    mass: 0,
    material: new CUBIC.Material({
        restitution:0
    })
});
Spinner.position.y = 5;
Spinner.angularVelocity.set(0,0.5,0)
add(Spinner, true);



for(let i = 0; i < 10; i++) {
    const Cube = new CUBIC.Body({
        shapes:new CUBIC.Box(1, 1, 1),
        mass:1,
        material: new CUBIC.Material({
            restitution:0
        })
    });
    /*Cube.angularVelocity.set(1,1,1);
    Cube.angularVelocity.mulScalar(Math.random());
    Cube.angularVelocity.sub(
        0.5,
        0.5,
        0.5
    );*/
    Cube.position.y += 20;
    Cube.position.x += 5;
    add(Cube, true);
}



let autoUpdate = true;
sync();

function updateRenders() {
    requestAnimationFrame(updateRenders);
    animate();
    if(autoUpdate) updatePhysics(fixedDeltaTime);
}
function updatePhysics(time) {
    world.step(time);
    sync();
}
function sync() {
    for(const sync of objects) {
        sync.THREEObject.position.copy(sync.CUBICObject.position);
        sync.THREEObject.quaternion.copy(sync.CUBICObject.quaternion);


        //LIMITER


        const body = sync.CUBICObject;
        if(
            body.position.x >  groundSize / 2 ||
            body.position.x < -groundSize / 2 ||
            body.position.z >  groundSize / 2 ||
            body.position.z < -groundSize / 2 ||
            body.position.y < -20
        ) {
            body.position.set(5,5,5);
            body.position.mulScalar(Math.random() * groundSize);
            body.position.sub(
                groundSize/2,
                groundSize/2,
                groundSize/2
            );
            body.position.y = 40;
            body.velocity.normalize();
        }
    }
}
updateRenders();

document.addEventListener("keydown", (e) => {
    if(e.key == "Space") autoUpdate = !autoUpdate;
    if(e.key == "d")
        updatePhysics(fixedDeltaTime);
    if(e.key == "D") for(let i = 0; i < 10; i++)
        updatePhysics(fixedDeltaTime);
});

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