import { Group, Box3, Box3Helper } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MINECRAFT from './minecraft.gltf';
import MARINE from './marine.gltf';

class Diver extends Group {
    constructor(meshObj) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'diver';
        // this.position.y = 0;
        var MODEL;
        if (meshObj == "MINECRAFT") {
            MODEL = MINECRAFT;
            this.model = "MINECRAFT";
        }
        if (meshObj == "MARINE") {
            MODEL = MARINE;
            this.model = "MARINE";
        }
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
