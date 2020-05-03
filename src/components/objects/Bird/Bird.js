import { Group, AnimationMixer, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

import MODEL from './Parrot.glb';

class Bird extends Group {
    constructor(parent, ids) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: false,
            spin: this.spin.bind(this),
            twirl: 0,
            mixers: [],
        };
        // this.mixer = undefined;

        // Load object
        var loader = new GLTFLoader();

        this.name = 'bird' + String(ids);
        this.ids = ids;
        this.position.x = parent.state.diver.position.x - 15;
        this.position.y = parent.state.diver.position.y - 30;
        this.position.z = parent.state.diver.position.z - 10;

        var relativePosToDiver = new Vector3(
            parent.state.diver.position.x,
            this.position.y,
            parent.state.diver.position.z,
        );
        this.flightDirection = new Vector3().subVectors(relativePosToDiver, this.position).setLength(0.1);

      	loader.load( MODEL, ( gltf ) => {
      		var mixer = new AnimationMixer( gltf.scene );
          gltf.animations.forEach((clip) => {
            var mixer = new AnimationMixer( gltf.scene );
            mixer.clipAction(clip).play();
            this.state.mixers.push(mixer);
          });
      		// action.play();
          // this.mixer = mixer;
      		this.add( gltf.scene );

      	}, undefined, ( error ) => {

      	   console.error( error );

        } );


        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    spin() {
        // Add a simple twirl
        // this.state.twirl += 12 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        //
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 1200)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 1200)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            // this.position.z = 50;
            // console.log("bird",this.position);
            // this.scale(new THREE.Vector3(0.001,0.001,0.001));
            // this.position;
            // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        this.scale.set(0.1,0.1,0.1);

        // calculate the direction the bird should fly in
        
        this.position.add(this.flightDirection);
        
        // Advance tween animations, if any exist
        TWEEN.update();
    }


}

export default Bird;
