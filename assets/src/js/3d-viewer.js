const THREE = require('three');

const CONFIG = {
    fillColor: 0x2c2a30,

    materialColor: 0xffffff,
    materialOpacity: 1.0,

    cameraDistance: 10,
    cameraSpeed: 0.01,

    rotationSpeed: 0.01,

    ambientLightColor: 0xffffff,
    ambientLightStrength: 0.15,
    directionalLightColor: 0xffffff,
    directionalLightStrength: 0.75,
};

const canvas = document.getElementById("3d-viewer-canvas");
const icosphereButton = document.getElementById('icosphere-button');
const cubeButton = document.getElementById('cube-button');
const skullButton = document.getElementById('skull-button');

let autoRotate = true;

if (icosphereButton && cubeButton && skullButton) {
    icosphereButton.addEventListener("click", function () {
        draw('/models/test.obj', 'icosphere.obj');
    });

    cubeButton.addEventListener("click", function () {
        draw('/models/cube.obj', 'cube.obj');
    });

    skullButton.addEventListener("click", function () {
        draw('/models/skull.obj', 'skull.obj');
    });
}

async function draw(filepath = '', filename = '') {

    try {

        autoRotate = true;

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

        let solidMesh, wireframe_lines;

        async function createFile(path, filename, type) {
            let response = await fetch(path);
            let data = await response.blob();
            return new File([data], filename, { type });
        }

        let vert_data = {};
        let face_data = { "vertices": {}, "uvs": {} };
        let uv_data = {};

        function readObjFile(file) {
            const reader = new FileReader();

            reader.onload = () => {
                let vert_index = 0;
                let face_index = 0;
                let uv_index = 0;
                const lines = reader.result.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();

                    if (! line) {
                        continue;
                    }

                    if (line.startsWith('v ')) {
                        vert_index++;
                        let [x, y, z] = line.split(' ').slice(1).map(parseFloat);
                        vert_data[vert_index] = [x,y,z];
                    }

                    if (line.startsWith('f ')) {
                        face_index++;
                        face_data.vertices[face_index] = line.split(' ')
                            .slice(1)
                            .map((value) => {
                                return value.split('/').slice(0,1).map(parseFloat)[0];
                            });
                        face_data.uvs[face_index] = line.split(' ')
                            .slice(1)
                            .map((value) => {
                                return value.split('/').slice(1,2).map(parseFloat)[0];
                            });
                    }

                    if (line.startsWith('vt ')) {
                        uv_index++;
                        let [u,v] = line.split(' ').slice(1).map(parseFloat);
                        uv_data[uv_index] = [u,v];
                    }
                }
            };

            reader.onerror = () => {
                console.log("Error reading obj file");
            };

            reader.readAsText(file);
        }

        if (filepath !== '' && filename !== '') {
            const file = await createFile(filepath, filename, 'model/obj');
            readObjFile(file);
        }

        function buildMesh() {
            if (Object.keys(face_data.vertices).length === 0) {
                return;
            }

            let verts_arr = [];
            let uv_arr = [];

            for (let i in face_data.vertices) {
                const face_vertex_indices = face_data.vertices[i];
                for (let j in face_vertex_indices) {
                    const index = face_vertex_indices[j];
                    verts_arr.push(vert_data[index][0]); // x
                    verts_arr.push(vert_data[index][1]); // y
                    verts_arr.push(vert_data[index][2]); // z
                }
            }

            for (let i in face_data.uvs) {
                const face_uv_indices = face_data.uvs[i];
                for (let j in face_uv_indices) {
                    const index = face_uv_indices[j];
                    uv_arr.push(uv_data[index][0]); // u
                    uv_arr.push(uv_data[index][1]); // v
                }
            }

            const textureLoader = new THREE.TextureLoader();
            // TODO Get texture map from .mtl file
            const texture = textureLoader.load('/models/skull_albedo_128.png');
            const verts = new Float32Array(verts_arr);
            const uvs = new Float32Array(uv_arr);
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.BufferAttribute(verts, 3 ));
            geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
            // TODO Get the normal data from the .obj file instead
            geometry.computeVertexNormals();
            const material = new THREE.MeshStandardMaterial({ map: texture, color: CONFIG.materialColor });
            material.opacity = CONFIG.materialOpacity;
            material.transparent = CONFIG.materialOpacity < 1.0;
            solidMesh = new THREE.Mesh(geometry, material);

            const wireframe = new THREE.WireframeGeometry(geometry);
            wireframe_lines = new THREE.LineSegments(wireframe);
            // TODO Not sure this is working
            wireframe_lines.material.depthWrite = false;
            wireframe_lines.material.opacity = 0.15;
            wireframe_lines.material.transparent = true;
        }

        let lastMouseX = 0;
        let lastMouseY = 0;

        canvas.addEventListener("mousemove", (e) => {
            const isRotating = e.buttons !== 0 && e.shiftKey;

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

            if (isRotating) {
                if (solidMesh) {
                    autoRotate = false;
                    // TODO Docs say something about use Object3D.rotation, look into that. The page also seems to lag quite a bit if you try to rotate a lot
                    solidMesh.rotateY(CONFIG.rotationSpeed * directionX * diffX);
                    wireframe_lines.rotateY(CONFIG.rotationSpeed * directionX * diffX);
                }
            } else {
                camera.position.x += CONFIG.cameraSpeed * directionX * diffX;
                camera.position.y += CONFIG.cameraSpeed * directionY * diffY;
            }

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });

        canvas.addEventListener("wheel", (e) => {
            // Forward appears to be z -1
            camera.position.z += CONFIG.cameraSpeed * e.deltaY;
        });

        function animate() {
            requestAnimationFrame(animate);
            if (! solidMesh) {
                buildMesh();
            }
            if (solidMesh) {
                // TODO Not sure if needed?
                // scene.remove(solidMesh);
                // scene.remove(wireframe_lines);
                // solidMesh.material.dispose();
                if (autoRotate) {
                    solidMesh.rotateY(THREE.MathUtils.degToRad(0.5));
                    wireframe_lines.rotateY(THREE.MathUtils.degToRad(0.5));
                }
                scene.add(solidMesh);
                scene.add(wireframe_lines);
            }
            renderer.render(scene, camera);
        }

        animate();

    } catch (error) {
        console.log(error);
    }

}

// TODO Maybe stop bundling every js file into one script so we don't have to do things like this
if (canvas) {
    draw();
}
