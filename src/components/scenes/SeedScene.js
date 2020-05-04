import * as Dat from 'dat.gui';
import { Scene, Color, Mesh, Vector3 } from 'three';
import { Eagle, Bird, Diver, Ring, Cloud, Land, Flower, Tree } from 'objects';
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
            mixers: {},
            bird_id_counter: 0,
        };
        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        this.diver = new Diver();
        this.lights = new BasicLights();
        this.land = new Land();
        this.land.position.y = -5;
        this.cloud = new Cloud();
        this.tree = new Tree(this);
        this.bird = new Bird(this);


        this.state.mixers = this.bird.state.mixers;

        this.tree.scale.set(10,10,10);
        this.tree.position.y = this.land.position.y;
        this.diver.position.y = 50;
        this.add(this.land, this.cloud, this.diver,
          this.bird, this.tree, this.lights);
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
        this.diver.position.y -= 0.1;

        // random number between 1 and randomness
        // add bird if condition satisfied
        let randomness = 350;
        let random = Math.floor(Math.random() * randomness) + 1;
        if (random == randomness) {
            var bird = new Bird(this, this.state.bird_id_counter++);
            this.state.mixers[bird.ids] = bird.state.mixers;
            this.add(bird);
        }

        this.handleGroundCollision();
    }

    handleGroundCollision() {
      let floorMesh = this.land;
      let floorPosition = floorMesh.position;
      const EPS = 0.1;

      if (this.diver.position.y - floorPosition.y < EPS) {
        this.diver.position.y = floorPosition.y + EPS;
      }
    }

}

export default SeedScene;
