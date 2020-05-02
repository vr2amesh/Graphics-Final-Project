import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land} from 'objects';
import { Eagle, Diver, Ring, Cloud } from 'objects';
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
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const eagle = new Eagle();
        const diver = new Diver();
        this.state.diver = diver;
        const ring = new Ring();
        const cloud = new Cloud();
        const lights = new BasicLights();
        this.add(cloud, ring, diver, eagle, lights);

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

        this.state.diver.position.y -= 0.1;
    }
}

export default SeedScene;
