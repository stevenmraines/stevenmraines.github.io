const THREE = require('three');

const CONFIG = {
    fillColor: 0x2c2a30,

    materialColor: 0xff0000,

    cameraDistance: 10,
    cameraSpeed: 0.01,

    ambientLightColor: 0xffffff,
    ambientLightStrength: 0.3,
    directionalLightColor: 0xffffff,
    directionalLightStrength: 0.8,
};

const icosphereButton = document.getElementById('icosphere-button');
const cubeButton = document.getElementById('cube-button');

if (icosphereButton && cubeButton) {
    icosphereButton.addEventListener("click", function () {
        draw('/models/test.obj', 'icosphere.obj');
    });

    cubeButton.addEventListener("click", function () {
        draw('/models/cube.obj', 'cube.obj');
    });
}

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

        let vert_data = [];
        let face_data = [];

        function readObjFile(file) {
            const reader = new FileReader();

            reader.onload = () => {
                let vert_index = 0;
                let face_index = 0;
                const lines = reader.result.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();

                    if (! line) {
                        continue;
                    }

                    if (line.startsWith('v ')) {
                        vert_index++;
                        // TODO Each vertex needs to appear once per triangle
                        let [x, y, z] = line.split(' ').slice(1).map(parseFloat);
                        vert_data[vert_index] = [x,y,z];
                    }

                    if (line.startsWith('f ')) {
                        face_index++;
                        face_data[face_index] = line.split(' ')
                            .slice(1)
                            .map((value) => {
                                return value.split('/').slice(0,1).map(parseFloat)[0];
                            });
                    }
                }
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

            let verts_arr = [];

            for (let i in face_data) {
                const face_vertex_indices = face_data[i];
                for (let j in face_vertex_indices) {
                    const index = face_vertex_indices[j];
                    verts_arr.push(vert_data[index][0]); // x
                    verts_arr.push(vert_data[index][1]); // y
                    verts_arr.push(vert_data[index][2]); // z
                }
            }

            const verts = new Float32Array(verts_arr);
            const geometry = new THREE.BufferGeometry();
            // TODO TypeError: can't access property "length", c[1] is undefined
            geometry.setAttribute( 'position', new THREE.BufferAttribute( verts, face_data[1].length ) );
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
                // Set these to prevent camera jumping around
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                return;
            }
            const directionX = e.clientX < lastMouseX ? -1 : 1;
            const directionY = e.clientY < lastMouseY ? 1 : -1;
            const diffX = Math.abs(e.clientX - lastMouseX);
            const diffY = Math.abs(e.clientY - lastMouseY);
            camera.position.x += CONFIG.cameraSpeed * directionX * diffX;
            camera.position.y += CONFIG.cameraSpeed * directionY * diffY;
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
