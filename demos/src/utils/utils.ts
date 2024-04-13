import * as THREE from 'three';

export const DEFAULT = {
    SEGMENTS: {
        SPHERE: 32
    },
    MATERIAL: new THREE.MeshStandardMaterial({color:'gray'})
}
export class ShapeCreator {
    scene;
    constructor(scene:THREE.Scene) {
      this.scene = scene;
    }
  
    addSphere(radius:number, position:THREE.Vector3, material:THREE.Material = DEFAULT.MATERIAL) {
        const geometry = new THREE.SphereGeometry(radius, DEFAULT.SEGMENTS.SPHERE, DEFAULT.SEGMENTS.SPHERE);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position);
        this.scene.add(sphere);
        return sphere;
    }
  
    addBox(width:number, height:number, depth:number, position:THREE.Vector3, material:THREE.Material = DEFAULT.MATERIAL) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const box = new THREE.Mesh(geometry, material);
        box.position.copy(position);
        this.scene.add(box);
        return box;
    }
}