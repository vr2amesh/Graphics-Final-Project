import * as Dat from 'dat.gui';
import { Scene, Color, Mesh } from 'three';
import { Eagle, Bird, Diver, Ring, Cloud, Land, Tree, Flower } from 'objects';
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
            mixers: [],
        };
        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        this.eagle = new Eagle();
        this.bird = new Bird(this);
        this.diver = new Diver();
        // this.state.diver = diver;
        this.ring = new Ring();
        this.land = new Land();
        this.land.position.y = -50;
        this.cloud = new Cloud();
        this.tree = new Tree(this);
        const lights = new BasicLights();


        this.state.mixers = this.bird.state.mixers;
        this.add(this.land, this.cloud, this.ring, this.diver, this.eagle,
          this.bird, this.tree, lights);
        this.tree.scale.set(10,10,10);
        this.tree.position.y = this.land.position.y;

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
        // this.tree.position.set(this.diver.position);
        // this.tree.scale.set(100,100,100);
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
