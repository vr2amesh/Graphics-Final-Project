import { Group, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide  } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Land extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'land';
        var geometry = new PlaneGeometry( 20000, 20000 );
        var material = new MeshBasicMaterial( {color: 0x228B22, side: DoubleSide} );
        var ground = new Mesh( geometry, material );
        ground.position.y = -100;
        ground.rotation.x = -Math.PI / 2;
        this.add(ground);
    }
}

export default Land;
