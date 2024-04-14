import * as THREE from 'three';

export const DEFAULT = {
    SEGMENTS: {
        BOX: 2,
        SPHERE: 32
    },
    MATERIAL: new THREE.MeshStandardMaterial({color:'gray'})
}
export const ShapeCreator = {
    createSphere(radius:number, material:THREE.Material = DEFAULT.MATERIAL) {
        const geometry = new THREE.SphereGeometry(radius, DEFAULT.SEGMENTS.SPHERE, DEFAULT.SEGMENTS.SPHERE);
        const sphere = new THREE.Mesh(geometry, material);
        return sphere;
    },
    createBox(width:number, height:number, depth:number, material:THREE.Material = DEFAULT.MATERIAL) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const box = new THREE.Mesh(geometry, material);
        return box;
    },
    createConvexPolygon() {
        return new THREE.BufferGeometry;
    }
}
export class MeshBuilder {
    parent?:THREE.Object3D;
    object:THREE.Object3D;
    
    constructor(parent?:THREE.Object3D) {
        this.parent = parent;
        this.object = new THREE.Object3D();
    }
    addShape(shape:THREE.Mesh) {
        this.object.add(shape);
    }
    setPosition(x:number, y:number, z:number) {
        this.object.position.set(x,y,z);
    }
    build() {
        this.parent?.add(this.object);
        return this.object;
    }
}