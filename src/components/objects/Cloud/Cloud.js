import { Object3D, Vector3, Box3, Box3Helper } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './cloud.gltf';
import * as CANNON from 'cannon';


class Cloud extends Object3D {
    constructor(parent, ids) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'cloud' + String(ids);
        this.ids = ids;
        this.scaleFactor = Math.random()*0.1;

        loader.load(MODEL, (gltf) => {
            gltf.scene.position.x = parent.diver.position.x - Math.floor(Math.random()*10-5);
            gltf.scene.position.y = parent.diver.position.y - Math.floor(Math.random()*80);
            gltf.scene.position.z = parent.diver.position.z - Math.floor(Math.random()*10-5);
            gltf.scene.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);

            this.box = new Box3().setFromObject( gltf.scene );
            this.center = this.box.getCenter( new Vector3() );

            console.log(this.center);
            this.box = new Box3().setFromObject( gltf.scene );
            var helper = new Box3Helper( this.box, 0xffff00 );
            this.add( helper );
            this.add(gltf.scene);
        });
    }

}

export default Cloud;
