/* eslint-disable */
/*
    node test/demo.js
*/
//@ts-check
import { MeshStandardMaterial, Vector3 } from "three";
import * as CUBIC from "../../src/Cubic.js";
import { init, log } from "./render.js";
import GJK from "../../src/collision/detection/narrow/GJK.js";

const world = new CUBIC.World({
    gravity: new CUBIC.Vector3(0,-0.4,0)
});



const demo = init();
demo.animate();

const width = 600;

const Ground = new CUBIC.Body({
    shapes: new CUBIC.Box(width,10,width),
    mass:0
});
Ground.position.y = -20;
demo.add(Ground);
world.add(Ground);


for(let i = 0; i < 200; i++) {
    const B = new CUBIC.Body({
        shapes: new CUBIC.Sphere(i/10 + 5),
        mass:i+1
    });
    B.position.set(-50,20,Math.random() * 100 - 50);
    B.velocity.set(30,-20,0);
    world.add(B);
    demo.add(B);
}



const fixedDeltaTime = 0.1;
let autoRun = true;

if(document) {
    window.onerror = e => {
        if(typeof e === "string") {
            log("json "+JSON.stringify({message: e}));
        } else
        log("json "+JSON.stringify(e));
    };
    function update(time) {
        world.step(fixedDeltaTime);
        if(autoRun) requestAnimationFrame(update);
        for(const obj of world.bodys) {
            if(obj.position.x > width/2 || obj.position.x < -width/2 || obj.position.z > width/2 || obj.position.z < -width/2) {
                obj.position.set(Math.random()*width -width/2,Math.random()*80+50,Math.random()*width -width/2);
                obj.velocity.set(Math.random()*5 -2.5,-20,Math.random()*5 -2.5);
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