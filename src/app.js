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


// Set up camera
camera.position.set(0, 50, 0);
let pos = new Vector3();
scene.diver.getWorldPosition(pos);
camera.lookAt(pos);
camera.position.add(scene.diver.position);
// scene.diver.add(camera);

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
controls.enabled = false;
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
    scene.world.step(1/60);
    // Copy coordinates from Cannon.js to Three.js
    scene.getObjectByName("diver").position.copy(scene.body.position);
    scene.getObjectByName("diver").quaternion.copy(scene.body.quaternion);

    let pos = new Vector3(0, 50, 0);
    pos.add(scene.diver.position);
    camera.position.copy(pos);
    camera.lookAt(scene.diver.position);

    // handle coordinate for the birds
    for (var i = 0; i < Object.keys(scene.state.bird_bodies).length; i++) {
        scene.state.bird_bodies[i].position.copy(
            scene.state.bird_bodies[i].position.vadd(scene.getObjectByName("bird" + String(i)).flightDirection)
        );
        scene.getObjectByName("bird" + String(i)).position.copy(scene.state.bird_bodies[i].position);
        scene.getObjectByName("bird" + String(i)).quaternion.copy(scene.state.bird_bodies[i].quaternion);
    }
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
        ArrowUp: new CANNON.Vec3(0.3, 0, 0),
        ArrowDown : new CANNON.Vec3(-0.3, 0, 0),
        ArrowLeft: new CANNON.Vec3(0, 0, -0.3),
        ArrowRight: new CANNON.Vec3(0, 0, 0.3)
    }
    if (event.key in keyMap == false) {return;}
    var body = scene.body;
    var direction = keyMap[event.key];
    console.log(body.velocity);
    body.velocity.copy(direction.vadd(body.velocity));
    console.log(body.velocity);
};
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener("keydown", diverPosition, false);
