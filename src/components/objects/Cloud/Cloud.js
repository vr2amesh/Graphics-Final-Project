import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './cloud.gltf';
import * as CANNON from 'cannon';


class Cloud extends Group {
    constructor(parent, ids) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();
        
        this.name = 'cloud' + String(ids);
        this.ids = ids;
        this.scaleFactor = Math.random()*0.05;

        loader.load(MODEL, (gltf) => {
            gltf.scene.position.x = parent.diver.position.x - Math.floor(Math.random()*15);
            gltf.scene.position.y = parent.diver.position.y - Math.floor(Math.random()*80);
            gltf.scene.position.z = parent.diver.position.z - Math.floor(Math.random()*10);
            gltf.scene.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
            this.add(gltf.scene);
        });
    }

}

export default Cloud;
