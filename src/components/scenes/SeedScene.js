import * as Dat from 'dat.gui';
import { Scene, Color, Mesh, Vector3 } from 'three';
import { Eagle, Bird, Diver, Ring, Cloud, Land, Flower, Tree } from 'objects';
import { BasicLights } from 'lights';
import * as CANNON from 'cannon';

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
            bird_bodies: {},
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

        // physics initialization
        this.world = new CANNON.World();
        this.world.gravity.set(0,-1,0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;


        // materials

        const groundMat = new CANNON.Material();
        const diverMat = new CANNON.Material();

        const contactMaterial = new CANNON.ContactMaterial(groundMat, diverMat, {
            friction: 0.01
        });

        this.world.addContactMaterial(contactMaterial);

        // diver physics
        let shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
        let mass = 1;
        this.body = new CANNON.Body({
        mass: 1,
        material: diverMat 
        });
        this.body.addShape(shape);
        this.body.angularVelocity.set(0,0,0);
        this.body.position.set(10,100,20);
        this.body.angularDamping = 0.5;
        this.world.addBody(this.body);

        // ground
        var groundShape = new CANNON.Plane();
        var groundBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, -6, 0),
            material: groundMat 
            });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
        this.world.addBody(groundBody);
        this.diver.position.copy(this.body.position);
        this.diver.quaternion.copy(this.body.quaternion);



        // Set up trees
        // random number between 1 and randomness
        // add tree if condition satisfied
        let random_num_tree = 30;
        this.tree = new Tree(this, random_num_tree);

        this.tree.scale.set(10,10,10);
        this.tree.position.y = this.land.position.y;
        this.add(this.land, this.cloud, this.diver, this.tree, this.lights);
        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
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

        // random number between 1 and randomness
        // add bird if condition satisfied
        let randomness = 100;
        let random = Math.floor(Math.random() * randomness) + 1;
        if (random == randomness) {
            var bird = new Bird(this, this.state.bird_id_counter++);
            this.state.mixers[bird.ids] = bird.state.mixers;
            this.addBirdToPhysicsWorld(bird);
            this.add(bird);
        }

        this.handleGroundCollision();
    }

    addBirdToPhysicsWorld(bird) {
        let shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
        const groundMat = new CANNON.Material();
        const birdMat = new CANNON.Material();
        const contactMaterial = new CANNON.ContactMaterial(groundMat, birdMat, {
            friction: 0.5
        });
        this.world.addContactMaterial(contactMaterial);
        let body = new CANNON.Body({
            mass: 1,
            material: birdMat
        });

        body.addShape(shape)
        body.angularVelocity.set(0,0,0);
        body.position.set(
            bird.position.x,
            bird.position.y,
            bird.position.z,
        );
        body.angularDamping = 0.5;
        this.state.bird_bodies[bird.ids] = body;
        this.world.addBody(body);
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
