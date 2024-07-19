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
    gravity: new Vector3(0, -0.91, 0)
});


const groundSize = 10;
const Ground = new CUBIC.Body({
    shape: new CUBIC.Box(groundSize,1,groundSize),
    mass: 0,
    material: new CUBIC.Material({
        restitution:0.9
    })
});
add(Ground);

const sphere = new CUBIC.Body({
    shape: new CUBIC.Sphere(1),
    mass:100
});

add(sphere);
sphere.position.set(0,1.5,0)



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
    const vec = sphere.velocity.clone();
    vec.add(vec.normalized(sphere.shapes[0].parameters.radius));
    console.plot.vector(vec, sphere.position, 1/15*1000);
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
            if(true) return;
            body.position.set(
                Math.random(),
                Math.random(),
                Math.random()
            );
            body.position.mulScalar(groundSize);
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
    if(e.key == " ") autoUpdate = !autoUpdate;
    if(e.key == "d")
        updatePhysics(fixedDeltaTime);
    if(e.key == "D") for(let i = 0; i < 10; i++)
        updatePhysics(fixedDeltaTime);
});

function add(body, randomColor = false) {
    const object = new MeshBuilder(scene);
    const geometry = cubicShapeAdaptor(body.shapes);
    if(randomColor) geometry.material = new THREE.MeshStandardMaterial({
        color: Math.round(Math.random() * 255 * 255 * 255)
    });
    object.addShape(geometry);
    object.setPosition(body.position.x, body.position.y, body.position.z);
    
    objects.push({
        THREEObject: object.build(),
        CUBICObject: body
    });
    
    world.add(body);
}