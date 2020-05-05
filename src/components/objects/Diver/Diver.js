import { Group, Box3, Box3Helper } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './minecraft.gltf';

class Diver extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'diver';
        // this.position.y = 0;
        loader.load(MODEL, (gltf) => {
            gltf.scene.castShadow = true;
            gltf.scene.position.set(0,0,0);

            // this.box = new Box3().setFromObject( gltf.scene ).expandByScalar (100);
            // var helper = new Box3Helper( this.box, 0xffff00 );
            // this.add(helper);
            this.add(gltf.scene);
        });
    }
}

export default Diver;
