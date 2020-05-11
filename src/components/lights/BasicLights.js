import { Group, SpotLight, AmbientLight, HemisphereLight, CameraHelper, PointLight, DirectionalLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        var light = new DirectionalLight(0xffffff, 1.75);
        light.position.set(23, 50, 25);
        light.position.multiplyScalar(1.3);

        light.castShadow = true;

        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;

        var d = 200;

        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;

        light.shadow.camera.far = 1000;

        var helper = new CameraHelper( light.shadow.camera );
        // this.add( helper );
        // this.add(ambi, hemi, dir, test, pointLight);
        this.add(ambi,light);
    }
}

export default BasicLights;
