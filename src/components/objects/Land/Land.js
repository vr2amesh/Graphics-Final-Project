import { Group, Mesh, PlaneGeometry, MeshStandardMaterial, DoubleSide, RepeatWrapping, TextureLoader  } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import LAND from './grasslight-big.png';


class Land extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'land';

        var geometry = new PlaneGeometry( 20000, 20000 );
        geometry.computeVertexNormals();
        var material = new MeshStandardMaterial({
          color: 0x404761, //0x3c3c3c,
          // specular: 0x404761, //0x3c3c3c//,
          metalness: 0.3,
          flatShading: true,
        });
        // var material = new MeshPhongMaterial( {color: 0x228B22, side: DoubleSide} );
        var ground = new Mesh( geometry, material );
        ground.position.y = 0;
        ground.rotation.x = -Math.PI / 2;

        var loader = new TextureLoader();
        ground.texture = loader.load( "./src/components/objects/Land/grasslight-big.png" );
        ground.texture.wrapS = ground.texture.wrapT = RepeatWrapping;
        ground.texture.repeat.set( 500, 500 );
        ground.texture.anisotropy = 16;
        ground.material.map = ground.texture;
        ground.receiveShadow = true;
        this.add(ground);
    }
}

export default Land;
