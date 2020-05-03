import * as Dat from 'dat.gui';
import { Scene, Color, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three';
import { Eagle, Bird, Diver, Ring, Cloud } from 'objects';
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
        const eagle = new Eagle();
        const bird = new Bird(this);
        const diver = new Diver();
        this.state.diver = diver;
        const ring = new Ring();
        const cloud = new Cloud();
        const lights = new BasicLights();
        var geometry = new PlaneGeometry( 20000, 20000 );
        var material = new MeshBasicMaterial( {color: 0x228B22, side: DoubleSide} );
        var ground = new Mesh( geometry, material );
        ground.position.y = -50;
        ground.rotation.x = -Math.PI / 2;
        this.state.mixers = bird.state.mixers;
        this.add(ground, cloud, ring, diver, eagle, bird, lights);

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
