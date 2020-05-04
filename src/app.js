/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, BasicShadowMap } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import * as CANNON from 'cannon';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = BasicShadowMap;

// cannon initialization
let world = new CANNON.World();
world.gravity.set(0,-1,0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

let shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
let mass = 1;
let body = new CANNON.Body({
mass: 1
});
body.addShape(shape);
body.angularVelocity.set(0,0,0);
body.position.set(1,1,1);
body.angularDamping = 0.5;
world.addBody(body);


// Set up camera
camera.position.set(-25, 70, 20);
// let pos = new Vector3();
// scene.state.diver.getWorldPosition(pos);
// camera.lookAt(scene.state.diver);
scene.diver.add(camera);

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();
// controls.enabled = false;
// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    timeStamp /= 10;
    // controls.update();
    if ( scene.state.mixers ) {
        for (var i = 0; i < Object.keys(scene.state.mixers).length; i++) {
            for (var j = 0; j < scene.state.mixers[i].length; j++) {
                scene.state.mixers[i][j].update(timeStamp / 100000)
            }
        }
    }
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    // update physics
    world.step(1/60);
    // Copy coordinates from Cannon.js to Three.js
    // scene.getObjectByName("diver").position.copy(body.position);
    // scene.getObjectByName("diver").quaternion.copy(body.quaternion);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();

const diverPosition = (event) => {
    const keyMap = {
        // ArrowUp: new Vector3().subVectors(
        //     scene.state.diver.position,
        //     new Vector3(camera.position.x, scene.state.diver.position.y, camera.position.z),
        // ),
        // ArrowRight: new Vector3().crossVectors(
        //     new Vector3().subVectors(
        //         new Vector3(camera.position.x, scene.state.diver.position.y, camera.position.z),
        //         scene.state.diver.position,
        //     ),
        //     new Vector3(0, -1, 0),
        // ),
        // ArrowLeft: new Vector3().crossVectors(
        //     new Vector3().subVectors(
        //         new Vector3(camera.position.x, scene.state.diver.position.y, camera.position.z),
        //         scene.state.diver.position,
        //     ),
        //     new Vector3(0, 1, 0),
        // ),
        // ArrowDown: new Vector3().subVectors(
        //     new Vector3(camera.position.x, scene.state.diver.position.y, camera.position.z),
        //     scene.state.diver.position,
        // ),
        ArrowUp: new Vector3(1, 0, 0),
        ArrowDown : new Vector3(-1, 0, 0),
        ArrowLeft: new Vector3(0, 0, -1),
        ArrowRight: new Vector3(0, 0, 1)
    }
    if (event.key in keyMap == false) {return;}
    var direction = keyMap[event.key].setLength(5);
    scene.diver.position.add(direction);
};
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener("keydown", diverPosition, false);
