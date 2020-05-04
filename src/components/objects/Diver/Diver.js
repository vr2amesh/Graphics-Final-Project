import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './diver.gltf';

class Diver extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'diver';
        // this.position.y = 0;
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
    }
}

export default Diver;