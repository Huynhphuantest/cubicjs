/* eslint-disable */
//@ts-check
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import ConvexPolygon from "../../src/shape/ConvexPolygon.js";
import Shape, { ShapeType } from "../../src/core/Shape.js";
import { Body, Box } from "../../src/Cubic.js";

let renderer, camera, scene;
export function init() {
    renderer = new THREE.WebGLRenderer({});
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera = new THREE.PerspectiveCamera(
        70, 
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    scene = new THREE.Scene();
    
    scene.add(camera);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1,1,1);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const controls = new OrbitControls( camera, renderer.domElement );

    camera.position.set( 0, 20, 50 );
    controls.update();
    
    renderer.domElement.id = "screen";
    document.body.appendChild(renderer.domElement);
    return {
        add,
        addBox,
        addSphere,
        animate
    };
}
function animate() {
    requestAnimationFrame( animate );
    for(const mesh of scene.children) { 
        if(mesh.collider) {
            mesh.position.copy(mesh.collider.position);
            mesh.quaternion.copy(mesh.collider.quaternion);
        }
    }
    renderer.render( scene, camera );
}
const objectMaterial = new THREE.MeshPhongMaterial({color: "gray"});
/**
 * @param {Body | Shape} obj
 */
function add(obj) {
    if(obj instanceof Shape) 
        addShape(obj);
    else if(obj instanceof Body)
        addBody(obj);
}
/**
 * @param {Shape} shape 
 * @returns {THREE.Mesh}
 */
function addShape(shape) {
    switch(shape.type) {
        case ShapeType.Box:
            //@ts-ignore
            return addBox(shape);
        case ShapeType.Sphere:
            return addSphere(shape);
    }
    throw new TypeError("Not valid shape"); 
}
/**
 * @param {Body} body 
 */
function addBody(body) {
    const mesh = new THREE.Group();    
    //@ts-ignore
    mesh.collider = body;
    //@ts-ignore
    body.mesh = mesh;
    body.shapes.forEach(e => {
        mesh.add(addShape(e));
    });
    scene.add(mesh);
}
/**
 * @param {Box} box 
 * @returns {THREE.Mesh}
 */
function addBox(box) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(
            box.parameters.width,
            box.parameters.height,
            box.parameters.depth
        ),
        objectMaterial
    );
    scene.add(mesh);
    return mesh;
}
function addSphere(sphere) {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(
            sphere.radius
        ),
        objectMaterial
    );
    scene.add(mesh);
    return mesh;
}



/**@type {HTMLUListElement} */
let logger;
/**
 * @param  {...string} messages
 */
export function log(...messages) {
    if(logger === undefined) initLog();
    messages.forEach(e => {
        const messageDOM = 
            (e.length > 7 && e.split(" ")[0] === "json") ?
                getLogJSON(e):
                document.createElement("li");
        if(messageDOM.textContent === null)
            messageDOM.appendChild(document.createTextNode(e));
        logger.appendChild(messageDOM);
        setTimeout(() => {
            logger.removeChild(messageDOM);
        },40000);
    });
}
/**
 * @param string
 * @returns {HTMLLIElement}
 */
function getLogJSON(e) {
    const lines = e.slice(6, e.length-1);
    const result = document.createElement("li");
    function addLine(a, spacing = 0, isProp) {
        spacing /= 2;
        const t = document.createElement("div");
        if(isProp) {
            const prop = a.split(":");
            t.style.display = "flex";
            t.style.gap = "0.25rem";
            const name = document.createElement("p");
            name.appendChild(document.createTextNode(
                //"" remover
                prop[0].slice(1, prop[0].length-1))
            );
            name.style.color = "gold";
            const value = document.createElement("p");
            value.appendChild(document.createTextNode(prop[1]));
            value.style.color = "lightblue";
            const seperator = document.createElement("p");
            seperator.appendChild(document.createTextNode(":"));
            t.appendChild(name);
            t.appendChild(seperator);
            t.appendChild(value);
        } else
            t.appendChild(document.createTextNode(a));
        t.style.paddingLeft = spacing+"ch";
        result.appendChild(t);
    }
    addLine("{");
    lines.split(",").forEach(e => {
        addLine(e, 4, true);
    });
    addLine("}");
    return result;
}
function initLog() {
    logger = document.createElement("ul");
    logger.id = "debug-log";
    document.body.appendChild(logger);
}