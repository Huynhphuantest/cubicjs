/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";


const renderProfilerDOM = document.querySelector("#render")!;

let renderer:THREE.WebGLRenderer,
    camera:THREE.Camera,
    scene:THREE.Scene;
export function init() {
    renderer = new THREE.WebGLRenderer({});
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera = new THREE.PerspectiveCamera(
        70, 
        window.innerWidth / window.innerHeight,
        0.1,
        20000
    );
    scene = new THREE.Scene();
    
    scene.add(camera);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(-1,1,-1);
    light.castShadow = true;
    scene.add(light);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const controls = new OrbitControls( camera, renderer.domElement );

    camera.position.set( 0, 100, 200 );
    controls.update();
    
    renderer.domElement.id = "screen";
    document.body.appendChild(renderer.domElement);
    animate();
    return {
        animate
    };   
}
function animate() {
    
    requestAnimationFrame( animate );
    
    const renderStartTime = performance.now();

    renderer.render( scene, camera );

    if(renderProfilerDOM !== null)
        renderProfilerDOM.innerHTML = `RenderTime: ${(performance.now() - renderStartTime).toFixed(2)}ms`;
}

let logger:HTMLUListElement;
export function log(...messages:string[]) {
    if(logger === undefined) initLog();
    messages.forEach(e => {
        let messageDOM;
        if(typeof e === 'object') {
            if(!Array.isArray(e)) messageDOM = logJSON(e);
            else messageDOM = document.createElement('div');
        }
        else {
            messageDOM = document.createElement("li")
            messageDOM.appendChild(document.createTextNode(e));
        }
        //@ts-ignore
        logger.appendChild(messageDOM);
        logger.scrollTop = logger.scrollHeight;

        if(logger.children.length > 50) {
            logger.removeChild(logger.children[0]);
        }
    });
}

export let SPACE_SIZE = 2;
export let LOG_COLOR_PALLET = {
    KEY: 'ffff00',
    VALUE: {
        NUMBER: 'ffdd00',
        STRING: '44dd88',
        BOOLEAN: {
            TRUE: 'aaccff',
            FALSE: 'dd4411'
        }
    }
};

export let WEIGHTS = {
    BOLD: 700,
    NORMAL: 400,
    THIN: 100
};

export let NUMBER_MAX_DECIMAL_POINT = 2;

let chToPx = 0;

export function logJSON(obj:Object, translate = 0) {
    const result = document.createElement('li');
    result.style.listStyle = 'none';
    function createSpace(amount:number) {
        const element = document.createElement('div');
        let str = "";
        for(let i = 0; i < amount; i++) {
            str = str+"_";
        }
        element.style.opacity = '0';
        element.appendChild(document.createTextNode(str));
        return element;
    }
    let space = 0;
    function createLine(...strings:string[]) {
        const element = document.createElement('ul');
        element.style.display = 'flex';
        element.style.gap = '0.5ch';
        element.style.translate = `-${translate}px`;
        element.appendChild(createSpace(space*SPACE_SIZE));
        for(const str of strings) {
            element.appendChild(document.createTextNode(str));
        }
        result.appendChild(element);
        return element;
    }
    function createNode(text:string, weight = 700, color = 'ffffff') {
        const node = document.createElement('div');
        node.style.color = `#${color}`;
        node.style.fontWeight = `${weight}`;
        node.appendChild(document.createTextNode(text));
        return node;
    }
    
    const startLine = createLine();
    startLine.appendChild(
        createNode(obj.constructor.name, WEIGHTS.NORMAL, LOG_COLOR_PALLET.KEY)
    );
    startLine.appendChild(
        document.createTextNode('{')
    );
    startLine.style.translate = '';
    space += 1;
    for(const [key, value] of Object.entries(obj)) {
        const line = createLine();
        const keyNode = createNode(key, WEIGHTS.THIN,LOG_COLOR_PALLET.KEY);
        line.appendChild(keyNode);

        const seperatorNode = createNode(':');
        line.appendChild(seperatorNode);


        const MAX_DECIMAL_POINT = Math.pow(10, NUMBER_MAX_DECIMAL_POINT);
        /**@type {HTMLElement} */
        let valueNode;
        if(typeof value !== 'object') {
            valueNode = createNode( (

                typeof value === 'number' ?
                    `${Math.round(value * MAX_DECIMAL_POINT) / MAX_DECIMAL_POINT}` :
                typeof value === 'string' ?
                    `"${value}"` :
                value
                ),

                WEIGHTS.NORMAL,

                (
                typeof value === 'number' ?
                    LOG_COLOR_PALLET.VALUE.NUMBER :
                typeof value === 'string' ?
                    LOG_COLOR_PALLET.VALUE.STRING :
                typeof value === 'boolean' ?
                    value ?
                        LOG_COLOR_PALLET.VALUE.BOOLEAN.TRUE :
                        LOG_COLOR_PALLET.VALUE.BOOLEAN.FALSE
                    :
                'ffffff'

            ));
            valueNode.style.marginLeft = '0.5ch';
        } else {
            if(!Array.isArray(value))
                valueNode = logJSON(value,
                    (chToPx*2.5) +
                    (key.length * chToPx)
                );
            else 
                valueNode = document.createElement('div');
            //TODO: ADD ARRAY LOG
        }
        line.appendChild(valueNode);
    }
    space -= 1;
    createLine('}');
    return result;
}
function initLog() {
    //@ts-ignore
    logger = document.querySelector("#console");
    /**@type {*} */
    let sizeDOM = document.createElement('div');
    sizeDOM.appendChild(document.createTextNode('0'));
    sizeDOM.style.width = 'fit-content';
    logger.appendChild(sizeDOM);
    chToPx = sizeDOM.getBoundingClientRect().width;

    logger.removeChild(sizeDOM);
}