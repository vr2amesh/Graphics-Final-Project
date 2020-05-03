import * as Dat from 'dat.gui';
<<<<<<< HEAD
import { Scene, Color, Mesh } from 'three';
import { Eagle, Bird, Diver, Ring, Cloud, Land, Tree, Flower } from 'objects';
<<<<<<< HEAD
=======
=======
import { Scene, Color, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide, Vector3 } from 'three';
import { Eagle, Bird, Diver, Ring, Cloud, Land, Flower } from 'objects';
>>>>>>> 870fc6cc1bca7a766efe5267e218b06a56395ca7
>>>>>>> dce103db62003b33603689a7e6ba4e11c4a13a33
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            diver: undefined,
            mixers: {},
            bird_id_counter: 0,
        };
        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        var diver = new Diver();
        this.state.diver = diver;
        var lights = new BasicLights();
        this.land = new Land();
        var flower = new Flower(this);
        this.land.position.y = -50;
<<<<<<< HEAD
        this.cloud = new Cloud();
        this.tree = new Tree(this);
        const lights = new BasicLights();


        this.state.mixers = this.bird.state.mixers;
        this.add(this.land, this.cloud, this.ring, this.diver, this.eagle,
          this.bird, this.tree, lights);
        this.tree.scale.set(10,10,10);
        this.tree.position.y = this.land.position.y;
<<<<<<< HEAD
=======
=======

        this.add(this.land, diver, lights, flower);
>>>>>>> 870fc6cc1bca7a766efe5267e218b06a56395ca7
>>>>>>> dce103db62003b33603689a7e6ba4e11c4a13a33

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
<<<<<<< HEAD
=======
<<<<<<< HEAD
        this.diver.position.y -= 0.1;
        // this.tree.position.set(this.diver.position);
        // this.tree.scale.set(100,100,100);
=======
>>>>>>> dce103db62003b33603689a7e6ba4e11c4a13a33

        this.state.diver.position.y -= 0.1;

        // random number between 1 and randomness
        // add bird if condition satisfied
        let randomness = 350;
<<<<<<< HEAD
        let random = Math.floor(Math.random() * randomness) + 1;
=======
        let random = Math.floor(Math.random() * randomness) + 1; 
>>>>>>> dce103db62003b33603689a7e6ba4e11c4a13a33
        if (random == randomness) {
            var bird = new Bird(this, this.state.bird_id_counter++);
            this.state.mixers[bird.ids] = bird.state.mixers;
            this.add(bird);
        }
<<<<<<< HEAD
=======
>>>>>>> 870fc6cc1bca7a766efe5267e218b06a56395ca7
>>>>>>> dce103db62003b33603689a7e6ba4e11c4a13a33
        this.handleGroundCollision();
    }

    handleGroundCollision() {
      let floorMesh = this.land;
      let floorPosition = floorMesh.position;
      const EPS = 0.1;
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> dce103db62003b33603689a7e6ba4e11c4a13a33
      if (this.diver.position.y - floorPosition.y < EPS) {
        this.diver.position.y = floorPosition.y + EPS;
=======

      if (this.state.diver.position.y - floorPosition.y < EPS) {
        this.state.diver.position.y = floorPosition.y + EPS;
>>>>>>> 870fc6cc1bca7a766efe5267e218b06a56395ca7
      }
    }

}

export default SeedScene;
