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
import BACKGROUNDSOUND from './Knowing_Nothing.mp3';

import { WebGLRenderer, PerspectiveCamera, Vector3, BasicShadowMap, AudioListener,
Audio, AudioLoader, Box3, Box3Helper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import * as CANNON from 'cannon';

const init = (meshObj) => {
    if (document.getElementById('canvas')) {
        mineCraftChosen = false;
        marineChosen = false;
      window.location.reload(true);
    }

    // Initialize core ThreeJS components
    const scene = new SeedScene(document, meshObj);
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
        let pos = new Vector3(0, 80, 0);

        var box = new Box3();
        box.setFromObject( scene.diver );
        var center = box.getCenter(new Vector3());
        pos.add(center);
        camera.position.copy(pos);
        camera.lookAt(center);


        renderer.render(scene, camera);
        scene.update && scene.update(timeStamp);
        window.requestAnimationFrame(onAnimationFrameHandler);
        // update physics
        scene.world.step(1/50);
        // Copy coordinates from Cannon.js to Three.js
        scene.getObjectByName("diver").position.copy(scene.body.position);
        scene.getObjectByName("diver").quaternion.copy(scene.body.quaternion);
        currentVel.innerHTML = `Velocity of Diver: ${scene.body.velocity.length().toFixed(2)}`

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
    thesholdVel.innerHTML = `Goal Velocity: ${scene.state.thresholdVelocity.toFixed(2)}`


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
            ArrowUp: new CANNON.Vec3(0, 0, -0.9),
            ArrowDown : new CANNON.Vec3(0, 0, 0.9),
            ArrowLeft: new CANNON.Vec3(-0.9, 0, 0),
            ArrowRight: new CANNON.Vec3(0.9, 0, 0)
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
var mineCraftChosen = false;
var marineChosen = false;

const getPointerLock = () => {
    startButton.onclick = function () {
      container.requestPointerLock();
      mineCraftChosen = true;
    }
    marineButton.onclick = function() {
        container.requestPointerLock();
        marineChosen = true;
    }
    document.addEventListener('pointerlockchange', lockChange, false);
}

const lockChange = () => {
    // Turn on controls
    if (document.pointerLockElement === container) {
        // Hide blocker and instructions
        blocker.style.display = "none";
        velocityDisplay.style.display = "";
        if (instructions.innerHTML != "Click to resume play!") {
            if (marineChosen) {
                init("MARINE")
            }
            else if (mineCraftChosen) {
                init("MINECRAFT");
            }
        }
    // Turn off the controls
    } else {
      // Display the blocker and instruction
        blocker.style.display = "";
        velocityDisplay.style.display = "none";
        frontimg.src =  FRONTIMAGE;
        blocker.appendChild(instructions)
        try {
            blocker.removeChild(buttons)
        } catch (error) {
            if (error instanceof DOMException) {
                console.log("Already removed!")
            }
            else {
                throw error;
            }
        }
        instructions.innerHTML = "Click to resume play!"
        document.onclick = function () {
            container.requestPointerLock();
          }
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

const velocityDisplay = document.createElement("div");
velocityDisplay.setAttribute("id", "velocityDisplay");
velocityDisplay.style.display = "none";

const currentVel = document.createElement("div");
currentVel.setAttribute("id", "currentVel");

const thesholdVel = document.createElement("div");
thesholdVel.setAttribute("id", "thesholdVel");

const instructions = document.createElement("div");
instructions.setAttribute("id", "instructions");
// const text = document.createElement("strong");

const buttons = document.createElement("div");
buttons.setAttribute("id", "buttons");

const startButton = document.createElement("button");
startButton.setAttribute("id", "startButton");
startButton.innerText = "Play with Minecraft Diver!"

const marineButton = document.createElement("button");
marineButton.setAttribute("id", "marineButton");
marineButton.innerText = "Play with a Marine Diver!"

const instructionsButton = document.createElement("button");
instructionsButton.setAttribute("id", "instructionsButton");
instructionsButton.innerText = "Click for Instructions!"
var insShow = false;
instructionsButton.onclick = function() {
  if (!insShow) {
    frontimg.style.display = "none"
    instructions.innerHTML = startInstructions();
    insShow = true;
  } else {
    frontimg.style.display = ""
    insShow = false;
    instructions.innerHTML = ""
  }
}

const startInstructions = () => {
    return (`
        You are a diver falling from the sky!!!
        Control the diver using the arrow keys &#8592; &#8593; &#8594; &#8595;
        <br>
        <br>
        Your goal is to hit the ground with a low enough velocity so that you can survive.
        <br>
        <br>
        If your velocity is too high, then you will lose the game. Hit clouds and birds in
        <br>
        <br>
        order to lower your velocity. If you pass through a ring, then your speed will
        <br>
        <br>
        increase. So please avoid those rings! Good Luck and Happy Diving!!!!!!!!
    `);
}


document.body.appendChild(container);
container.appendChild(blocker);
velocityDisplay.appendChild(currentVel);
velocityDisplay.appendChild(thesholdVel);
container.appendChild(velocityDisplay);
blocker.appendChild(instructions);
blocker.appendChild(frontimg);
blocker.appendChild(buttons);
buttons.appendChild(startButton);
buttons.appendChild(marineButton);
buttons.appendChild(instructionsButton);
// instructions.appendChild(text);

getPointerLock();
