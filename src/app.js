/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FRONTIMAGE from './fly.png';
import BACKGROUNDSOUND from './muxia_bgm.mp3';

import { WebGLRenderer, PerspectiveCamera, Vector3, BasicShadowMap, AudioListener,
Audio, AudioLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import * as CANNON from 'cannon';

const init = () => {
    if (document.getElementById('canvas')) {
      window.location.reload(true);
    }

    // Initialize core ThreeJS components
    const scene = new SeedScene(document);
    // const camera = undefined;
    var camera = new PerspectiveCamera();
    camera.name = 'camera';
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = BasicShadowMap;


    // Set up camera
    camera.position.set(0, 60, 0);
    let pos = new Vector3();
    scene.diver.getWorldPosition(pos);
    camera.position.add(scene.diver.position);
    camera.up = new Vector3(0,1,-0.1);
    // camera.lookAt(new Vector3(0,0,0));
    // scene.diver.add(camera);

    // Set up sound
    // create an AudioListener and add it to the camera
    var listener = new AudioListener();
    listener.name = "listener";
    // scene.add( listener );

    // create a global audio source
    var sound = new Audio( listener );
    sound.name = "sound";

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new AudioLoader();
    audioLoader.load( BACKGROUNDSOUND, function( buffer ) {
    	sound.setBuffer( buffer );
    	sound.setLoop( true );
    	sound.setVolume( 0.5 );
    	sound.play();
    });
    scene.add(sound);

    // Set up renderer, canvas, and minor CSS adjustments
    renderer.setPixelRatio(window.devicePixelRatio);
    const canvas = renderer.domElement;
    canvas.style.display = 'block'; // Removes padding below canvas
    document.body.style.margin = 0; // Removes margin around page
    document.body.style.overflow = 'hidden'; // Fix scrolling
    canvas.setAttribute("id", "canvas");
    if (document.getElementById("canvas")) {
      document.getElementById("canvas").remove();
    }
    document.body.appendChild(canvas);

    // Set up controls
    // const controls = new OrbitControls(camera, canvas);
    // // controls.enableDamping = true;
    // // controls.enablePan = false;
    // // controls.minDistance = 4;
    // // controls.maxDistance = 16;
    // // controls.update();
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
        let pos = new Vector3(0, 60, 0);
        pos.add(scene.body.position);
        camera.position.copy(pos);
        camera.up = new Vector3(0,1,-0.1);
        camera.lookAt(scene.diver.position);
        renderer.render(scene, camera);
        scene.update && scene.update(timeStamp);
        window.requestAnimationFrame(onAnimationFrameHandler);
        // update physics
        scene.world.step(1/50);
        // Copy coordinates from Cannon.js to Three.js
        scene.getObjectByName("diver").position.copy(scene.body.position);
        scene.getObjectByName("diver").quaternion.copy(scene.body.quaternion);



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
            ArrowUp: new CANNON.Vec3(0.9, 0, 0),
            ArrowDown : new CANNON.Vec3(-0.9, 0, 0),
            ArrowLeft: new CANNON.Vec3(0, 0, -0.9),
            ArrowRight: new CANNON.Vec3(0, 0, 0.9)
        }
        if (event.key in keyMap == false) {return;}
        var body = scene.body;
        var direction = keyMap[event.key];
        body.velocity.copy(direction.vadd(body.velocity));
    };
    window.addEventListener('resize', windowResizeHandler, false);
    window.addEventListener("keydown", diverPosition, false);
};


// Game loop
const getPointerLock = () => {
    document.onclick = function () {
      container.requestPointerLock();
    }
    document.addEventListener('pointerlockchange', lockChange, false);
}

const lockChange = () => {
    // Turn on controls
    if (document.pointerLockElement === container) {
        // Hide blocker and instructions
        blocker.style.display = "none";
        if (instructions.innerHTML != "Click to resume play!") {
          init();
        }
        // controls.enabled = true;
    // Turn off the controls
    } else {
      // Display the blocker and instruction
        blocker.style.display = "";
        frontimg.src =  FRONTIMAGE;
        instructions.innerHTML = "Click to resume play!"
        // controls.enabled = false;
    }
}
const container = document.createElement("div");
container.setAttribute("id", "container");
const blocker = document.createElement("div");
blocker.setAttribute("id", "blocker");

var frontimg = document.createElement('img');
frontimg.setAttribute("id", "frontimg");
frontimg.src =  FRONTIMAGE;


const instructions = document.createElement("div");
instructions.setAttribute("id", "instructions");
// const text = document.createElement("strong");
instructions.innerHTML = "Click to start!";


document.body.appendChild(container);
container.appendChild(blocker);
blocker.appendChild(frontimg);
blocker.appendChild(instructions);
// instructions.appendChild(text);

getPointerLock();
