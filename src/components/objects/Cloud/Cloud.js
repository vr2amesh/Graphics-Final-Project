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
        // this.scaleFactor = Math.random()*0.1;
        this.scaleFactor = 0.3;
        this.box = new Box3();
        this.box.max = new Vector3();
        this.box.min = new Vector3();
        this.size = new CANNON.Vec3();
        this.center = new Vector3();
        this.center_cannon = new CANNON.Vec3();


        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);

            gltf.scene.position.x = parent.diver.position.x - Math.floor(Math.random()*80-40);
            gltf.scene.position.y = parent.diver.position.y - Math.floor(Math.random()*200);
            gltf.scene.position.z = parent.diver.position.z - Math.floor(Math.random()*80-40);

            this.box.setFromObject( gltf.scene );
            var center = this.box.getCenter( new Vector3() );
            var diff = new Vector3().subVectors(gltf.scene.position, center);

            gltf.scene.position.add(diff);

            this.box.setFromObject( gltf.scene );
            this.center.copy(this.box.getCenter( new Vector3() ));
            console.log('in', this.center.x);
            this.center_cannon.x = this.center.x;
            this.center_cannon.y = this.center.y;
            this.center_cannon.z = this.center.z;

            this.size.x = Math.abs(this.box.max.x - this.box.min.x);
            this.size.y = Math.abs(this.box.max.y - this.box.min.y);
            this.size.z = Math.abs(this.box.max.z - this.box.min.z);

            this.add(gltf.scene);
        });

        // console.log(this.center_cannon);
    }

}

export default Cloud;
