const THREE = require('three');

const CONFIG = {
    fillColor: 0x2c2a30,

    materialColor: 0xff0000,

    cameraDistance: 10,
    cameraSpeed: 0.05,

    ambientLightColor: 0xffffff,
    ambientLightStrength: 0.3,
    directionalLightColor: 0xffffff,
    directionalLightStrength: 0.8,
};

async function draw(filepath, filename) {

    try {

        const canvas = document.getElementById("3d-viewer-canvas");
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(CONFIG.fillColor);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, CONFIG.cameraDistance);
        camera.lookAt(0, 0, 0);

        const ambient = new THREE.AmbientLight(CONFIG.ambientLightColor, CONFIG.ambientLightStrength);
        const directional = new THREE.DirectionalLight(CONFIG.directionalLightColor, CONFIG.directionalLightStrength);

        scene.add(ambient);
        directional.position.set(3, 5, 6);
        scene.add(directional);

        let solidMesh;

        async function createFile(path, filename, type) {
            let response = await fetch(path);
            let data = await response.blob();
            return new File([data], filename, { type });
        }

        let verts;

        function readObjFile(file) {
            const reader = new FileReader();
            reader.onload = () => {
                let data = [];
                for (let line of reader.result.split('\n')) {
                    if (! line) {
                        continue;
                    }
                    if (line.startsWith('v ')) {
                        // TODO Each vertex needs to appear once per triangle
                        let [x, y, z] = line.split(' ').slice(1).map(parseFloat);
                        data.push(x);
                        data.push(y);
                        data.push(z);
                        console.log(x, y, z);
                    }
                }
                verts = new Float32Array(data);
            };
            reader.onerror = () => {
                console.log("Error reading obj file");
            };
            reader.readAsText(file);
        }

        const file = await createFile(filepath, filename, 'model/obj');
        readObjFile(file);

        function buildMesh() {
            if (solidMesh) {
                scene.remove(solidMesh);
                solidMesh.material.dispose();
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.BufferAttribute( verts, 3 ) );
            const material = new THREE.MeshBasicMaterial( { color: CONFIG.materialColor } );
            solidMesh = new THREE.Mesh( geometry, material );
            scene.add(solidMesh);

            const wireframe = new THREE.WireframeGeometry( geometry );
            const line = new THREE.LineSegments( wireframe );
            line.material.depthWrite = false;
            line.material.opacity = 0.25;
            line.material.transparent = true;
            scene.add( line );
        }

        let lastMouseX = 0;
        let lastMouseY = 0;

        canvas.addEventListener("mousemove", (e) => {
            if (e.buttons === 0) {
                return;
            }
            const directionX = e.clientX < lastMouseX ? -1 : 1;
            const directionY = e.clientY < lastMouseY ? 1 : -1;
            camera.position.x += CONFIG.cameraSpeed * directionX;
            camera.position.y += CONFIG.cameraSpeed * directionY;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            // camera.lookAt(0, 0, 0);
        });

        canvas.addEventListener("wheel", (e) => {
            // Forward appears to be z -1
            camera.position.z += CONFIG.cameraSpeed * e.deltaY;
            // camera.lookAt(0, 0, 0);
        });

        function animate() {
            requestAnimationFrame(animate);
            buildMesh();
            renderer.render(scene, camera);
        }

        animate();

    } catch (error) {
        console.log(error);
    }

}

draw('/models/cube.obj', 'cube.obj');

document.getElementById('icosphere-button').addEventListener("click", function () {
    draw('/models/test.obj', 'icosphere.obj');
});

document.getElementById('cube-button').addEventListener("click", function () {
    draw('/models/cube.obj', 'cube.obj');
});
