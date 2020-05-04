import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './cloud.gltf';

class Cloud extends Group {
    constructor(parent, ids) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();
        var relativePosToDiver = new Vector3(
            parent.diver.position.x,
            this.position.y,
            parent.diver.position.z,
        );
        // this.flightDirection = new Vector3().subVectors(relativePosToDiver, this.position).setLength(0.1);
        this.name = 'cloud' + String(ids);
        this.ids = ids;

        loader.load(MODEL, (gltf) => {
            gltf.scene.position.x = parent.diver.position.x - Math.floor(Math.random()*15);
            gltf.scene.position.y = parent.diver.position.y - Math.floor(Math.random()*30);
            gltf.scene.position.z = parent.diver.position.z - Math.floor(Math.random()*10);
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            this.add(gltf.scene);
        });
    }
    update(timeStamp) {
        // this.position.add(this.flightDirection);
    }
}

export default Cloud;
