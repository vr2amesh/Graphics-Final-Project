import { Group, ImageLoader, Mesh, TextureLoader, MeshLambertMaterial } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import OBJFile from './texture/Tree.obj';
import MTLFile from "./texture/Tree.mtl";
import JPGFile_bark from './texture/bark_0021.jpg';
import JPGFile_poly_1 from './texture/DB2X2_L01.png';
import JPGFile_poly_2 from './texture/DB2X2_L01_Spec.png';

class Tree extends Group {
    constructor(parent, num_trees) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            bob: true,
            twirl: 0,
            trees: [],
        };

        var barkTexture = new TextureLoader().load(JPGFile_bark);
        var polyTexture = [new TextureLoader().load(JPGFile_poly_1),
          new TextureLoader().load(JPGFile_poly_2)];

        for (let i = 0; i < num_trees; i++) {
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
                              var texture = Math.floor(Math.random()*2);
                              child.material = new MeshLambertMaterial({
  							                  map:polyTexture[texture],
  					                  });
                              // child.material.map = polyTexture;
                            }
                            child.receiveShadow = true;
                            child.castShadow = true;
                        }
                    });
                    object.position.x = Math.floor(Math.random()*100)-50;
                    object.position.z = Math.floor(Math.random()*100)-50;
                    this.add(object);
                });

        });

      }
        // Add self to parent's update list
        parent.addToUpdateList(this);

    }

    update(timeStamp) {

    }
}

export default Tree;
