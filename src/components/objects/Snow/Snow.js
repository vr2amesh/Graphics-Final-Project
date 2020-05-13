import { Group, ParticleBasicMaterial, TextureLoader, BufferGeometry,
PointsMaterial, Float32BufferAttribute, Points, AdditiveBlending } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import SNOW from './snow.png';

class Snow extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
        };

        // create object
        this.materials = [];
        var geometry = new BufferGeometry();
				var vertices = [];

				var textureLoader = new TextureLoader();
				var sprite = textureLoader.load( SNOW );

        for ( var i = 0; i < 10000; i ++ ) {

					var x = Math.random() * 2000 - 1000;
					var y = Math.random() * 2000 - 1000;
					var z = Math.random() * 2000 - 1000;

					vertices.push( x, y, z );

				}
        geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
        geometry.attributes.position.needsUpdate = true;

        this.parameters = [
					[[ 1.0, 0.2, 0.5 ], sprite, 20 ],
					[[ 0.95, 0.1, 0.5 ], sprite, 15 ],
					[[ 0.90, 0.05, 0.5 ], sprite, 10 ],
					[[ 0.85, 0, 0.5 ], sprite, 8 ],
					[[ 0.80, 0, 0.5 ], sprite, 5 ]
				];

				for ( var i = 4; i < 5; i ++ ) {

					var color = this.parameters[ i ][ 0 ];
					var sprite = this.parameters[ i ][ 1 ];
					var size = this.parameters[ i ][ 2 ];

					this.materials[ i ] = new PointsMaterial( { size: size, map: sprite, blending: AdditiveBlending, depthTest: false, transparent: true } );
					this.materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

					var particles = new Points( geometry, this.materials[ i ] );
          this.check = particles.geometry.attributes.position;
					// particles.rotation.x = Math.random() * 6;
					// particles.rotation.y = Math.random() * 6;
					// particles.rotation.z = Math.random() * 6;

					this.add( particles );

				}


        // Add self to parent's update list
        parent.addToUpdateList(this);

    }



    update(timeStamp) {
        this.check
    }
}

export default Snow;
