/* eslint-disable */
/*
    node test/demo.js
*/
//@ts-check
import { MeshStandardMaterial } from "three";
import * as CUBIC from "../../src/Cubic.js";
import { init, log } from "./render.js";
import GJK from "../../src/collision/detection/narrow/GJK.js";

const world = new CUBIC.World({
    gravity: new CUBIC.Vector3(0,-0.7,0)
});



const demo = init();
demo.animate();

const width = 500;
const maxSpeed = 30;

const Ground = new CUBIC.Body({
    shapes: new CUBIC.Box(width,50,width),
    mass:0
});
Ground.position.y -= 20;
Ground.material.restitution = 1;
demo.add(Ground);
world.add(Ground);


const objectCountDOM = document.querySelector("#object");

for(let i = 0; i < 0; i++) {
    const B = new CUBIC.Body({
        shapes: new CUBIC.Sphere(5),
        mass:10
    });
    world.add(B);
    demo.add(B, true);
    B.material.restitution = 0.8;

    B.position.set(Math.random()*width-width/2,Math.random()*200+25,Math.random()*width-width/2);
    B.velocity.set(Math.random()*maxSpeed-maxSpeed/2,0,Math.random()*maxSpeed-maxSpeed/2);

    if(objectCountDOM !== null)
    objectCountDOM.innerHTML = "ObjectCount: "+world.bodys.length;
}



const B = new CUBIC.Body({
    shapes: new CUBIC.Box(25),
    mass:10
});
let angle = Math.PI/2;
B.quaternion.setFromAxisAngle(new CUBIC.Vector3(0,1,1).normalize(), angle);
setTimeout(() => {
    setInterval(() => {
        angle *= 0.9;
        B.quaternion.setFromAxisAngle(new CUBIC.Vector3(0,1,1).normalize(), angle);
    }, 1);
},1500);
B.position.y += 30+B.AABB.lowerBound.length()+Ground.position.y;
world.add(B);
demo.add(B, true);




const fixedDeltaTime = 0.1;
let autoRun = true;

const physicProfilerDOM = document.querySelector("#physic");

if(document) {
    window.onerror = e => {
        if(typeof e === "string") {
            log("json "+JSON.stringify({message: e}));
        } else
        log("json "+JSON.stringify(e));
    };
    function update(time) {
        const physicStartTime = performance.now();

        world.step(fixedDeltaTime);

        if(physicProfilerDOM !== null)
            physicProfilerDOM.innerHTML = `PhysicTime: ${performance.now() - physicStartTime}ms`;


        if(autoRun) requestAnimationFrame(update);

        // Limiter
        for(const obj of world.bodys) {
            if(obj === Ground) continue;
            if(obj.position.x > width/2 || obj.position.x < -width/2 || obj.position.z > width/2 || obj.position.z < -width/2) {
                obj.position.set(Math.random()*width -width/2,Math.random()*200+25,Math.random()*width -width/2);
                obj.velocity.set(Math.random()*maxSpeed-maxSpeed/2,0,Math.random()*maxSpeed-maxSpeed/2);
            }
        }
    }
    update(0);

    document.addEventListener("keydown", e => {
        if(e.key == " ") {
            if(!autoRun) {
                update();
                autoRun = true;
                return;
            }
            autoRun = false;
        }
        if(e.key == "d") {
            world.step(fixedDeltaTime);
        }
    });
}