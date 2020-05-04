import { Group, ImageLoader, Mesh, TextureLoader, MeshLambertMaterial } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Tree extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            twirl: 0,
        };

        var OBJFile = './src/components/objects/Tree/texture/Tree.obj';
        var MTLFile = './src/components/objects/Tree/texture/Tree.mtl';
        var JPGFile_bark = './src/components/objects/Tree/texture/bark_0021.jpg';
        var JPGFile_poly = './src/components/objects/Tree/texture/DB2X2_L01.png';

        var barkTexture = new TextureLoader().load(JPGFile_bark);
        var polyTexture = new TextureLoader().load(JPGFile_poly);

        var mtlloader = new MTLLoader()
        .load(MTLFile, (materials) => {
            materials.preload();
            new OBJLoader()
                .setMaterials(materials)
                .load(OBJFile, (object) => {

                    object.traverse(function (child) {
                        if (child instanceof Mesh) {
                            if ( child.material.name === "Trank_bark" ) {
                              child.material = new MeshLambertMaterial({
  							                  map:barkTexture,
  					                  });
                              child.material.map = barkTexture;
                            } else {
                              child.material = new MeshLambertMaterial({
  							                  map:polyTexture,
  					                  });
                              // child.material.map = polyTexture;
                            }
                            child.receiveShadow = true;
                            child.castShadow = true;
                        }
                    });

                    this.add(object);
                });
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {

    }
}

export default Tree;
