import * as Dat from 'dat.gui';
import { Fog, Scene, Color, Mesh, Vector3, BoxBufferGeometry, EdgesGeometry, LineSegments,
LineBasicMaterial, Box3, Box3Helper } from 'three';
import { Eagle, Bird, Diver, Ring, Cloud, Land, Flower, Tree, Snow } from 'objects';
import { BasicLights } from 'lights';
import * as CANNON from 'cannon';
import WINIMAGE from "../../win.png";
import LOSSIMAGE from "../../loss.png";

class SeedScene extends Scene {
    constructor(document) {
        // Call parent Scene() constructor
        super();

        // tie the document and blocker to the scene
        this.document = document;

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            mixers: {},
            bird_id_counter: 0,
            cloud_id_counter: 0,
            bird_bodies: {},
            cloud_bodies: {},
            rings: [],
            temp: 0,
        };
        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        this.diver = new Diver();
        this.lights = new BasicLights();
        this.land = new Land();
        this.land.position.y = -5;
        this.tree = new Tree(this);
        this.snow = new Snow(this);

        // add fog
        this.fog = new Fog(0xffffff, 300, 2100);

        // physics initialization
        this.world = new CANNON.World();
        this.world.gravity.set(0,-5,0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;


        // materials

        const groundMat = new CANNON.Material();
        const diverMat = new CANNON.Material();

        const contactMaterial = new CANNON.ContactMaterial(groundMat, diverMat, {
            friction: 0.9
        });

        this.world.addContactMaterial(contactMaterial);

        // diver physics
        let shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
        let mass = 1;
        this.body = new CANNON.Body({
        mass: 1,
        material: diverMat,
        linearDamping: 0.1
        });
        this.body.addShape(shape);
        this.body.angularVelocity.set(0,0,0);
        this.body.position.set(10,1900,20);
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

        // create ring sound
        this.ringSound = new Audio();
        this.ringSound.src = "src/components/objects/Ring/smw_cape_rise.wav";

        // Set up trees
        // random number between 1 and randomness
        // add tree if condition satisfied
        let random_num_tree = 30;
        this.tree = new Tree(this, random_num_tree);
        this.tree.scale.set(10,10,10);
        this.tree.position.y = this.land.position.y;
        this.add(this.land, this.diver, this.tree, this.lights, this.snow);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    randomCondition(randomness) {
        return (randomness ==  Math.floor(Math.random() * randomness) + 1);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        // random number between 1 and randomness
        // add bird and cloud if condition satisfied

        let randomness = 80;
        if (this.randomCondition(randomness)) {
            var bird = new Bird(this, this.state.bird_id_counter++);
            var cloud = new Cloud(this, this.state.cloud_id_counter++);
            this.state.mixers[bird.ids] = bird.state.mixers;
            this.addBirdToPhysicsWorld(bird);
            this.addCloudToPhysicsWorld(cloud);
            this.add(bird);
            this.add(cloud);
        }

        // generate rings according to a different random condition
        if (this.randomCondition(randomness)) {
            var ring = new Ring();
            ring.position.x = this.diver.position.x + Math.floor(Math.random() * 20) - 10;
            ring.position.y = this.diver.position.y - Math.floor(Math.random() * 50);
            ring.position.z = this.diver.position.z + Math.floor(Math.random() * 20) - 10;
            ring.scale.set(2.5, 2.5, 2.5);
            this.state.rings.push(ring);
            this.add(ring);
        }

        this.handleRingCollision();

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
        body.force.y += 1000;
        body.angularDamping = 0.5;
        body.linearDamping = 0.9;
        this.state.bird_bodies[bird.ids] = body;
        this.world.addBody(body);
    }

    addCloudToPhysicsWorld(cloud) {
        let factor = cloud.scaleFactor * 200;
        var boxSize = new Vector3(0,0,0);

        var helper = new Box3Helper( cloud.box, 0xffff00 );
        this.add( helper );

        let shape = new CANNON.Box(new CANNON.Vec3(20,10,15));

        const groundMat = new CANNON.Material();
        const cloudMat = new CANNON.Material();
        const contactMaterial = new CANNON.ContactMaterial(groundMat, cloudMat, {
            friction: 0.5
        });
        this.world.addContactMaterial(contactMaterial);
        let body = new CANNON.Body({
            mass: 0,
            material: cloudMat
        });

        body.addShape(shape)
        body.angularVelocity.set(0,0,0);

        body.position = cloud.center_cannon;

        body.angularDamping = 0.5;
        this.state.cloud_bodies[cloud.ids] = body;
        this.world.addBody(body);
    }
    handleGroundCollision() {
      let floorMesh = this.land;
      let floorPosition = floorMesh.position;
      const EPS = 0.1;

      if (this.diver.position.y - floorPosition.y < EPS) {
        this.diver.position.y = floorPosition.y + EPS;
        this.reStartGame(this.document);
      }
    }

    removeBodies() {
        for (var i = 0; i < Object.keys(this.state.bird_bodies).length; i++) {
            this.world.removeBody(this.state.bird_bodies[i]);
            this.remove(
                this.getObjectByName( "bird" + String(i) )
            );
        }

        for (var i = 0; i < Object.keys(this.state.cloud_bodies).length; i++) {
            this.world.removeBody(this.state.cloud_bodies[i]);
            this.remove(
                this.getObjectByName( "cloud" + String(i) )
            );
        }

        for (var i = 0; i < this.state.rings.length; i++) {
            this.remove(this.state.rings[i]);
        }
    }

    reStartGame(document) {
        const impactVelocity = this.body.velocity.length();
        const thresholdVelocity = 10000;

        if (this.body.velocity.length() < thresholdVelocity) {
            document.getElementById("frontimg").src = WINIMAGE;
            document.getElementById("instructions").innerHTML = "Congratulations. Click to Restart!"
        } else {
            document.getElementById("frontimg").src = LOSSIMAGE;
            document.getElementById("instructions").innerHTML = "Unfortunately, you lost. Click to Restart!"
        }
        document.getElementById("blocker").style.display = "";

        // this.removeBodies();
        //
        // this.state.mixers = {};
        // this.state.bird_id_counter = 0;
        // this.state.cloud_id_counter = 0;
        // this.state.bird_bodies = {};
        // this.state.cloud_bodies = {};
        // this.state.rings = [];
        // this.body.angularVelocity.set(0,0,0);
        // this.body.position.set(10,1900,20);
        // this.body.angularDamping = 0.5;

        // reset sound
        // this.getObjectByName('sound').stop();
    }

    handleRingCollision() {
        var diverBox = new Box3(
            new Vector3(
                this.body.position.x - 1 + 1,
                this.body.position.y - 1,
                this.body.position.z - 1 - 3,
            ),
            new Vector3(
                this.body.position.x + 1 + 1,
                this.body.position.y + 1,
                this.body.position.z + 1 - 3,
            ),
        );

        for (var i = 0; i < this.state.rings.length; i++) {
            var ringBox = new Box3(
                new Vector3(
                    this.state.rings[i].position.x - 3,
                    this.state.rings[i].position.y - 1,
                    this.state.rings[i].position.z - 3,
                ),
                new Vector3(
                    this.state.rings[i].position.x + 3,
                    this.state.rings[i].position.y + 1,
                    this.state.rings[i].position.z + 3,
                ),
            );
            if (ringBox.intersectsBox(diverBox)) {
                // Apply the downward force to the diver
                this.body.velocity.copy(
                    new CANNON.Vec3(0, -0.1, 0).vadd(this.body.velocity)
                );
                // play the sound effect
                this.ringSound.play();
            }
        }
    }

}

export default SeedScene;
