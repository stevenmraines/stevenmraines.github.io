const THREE = require('three');
const OBJHandler = require('./OBJHandler.js');

const CONFIG = {
    fillColor: 0x2c2a30,

    materialColor: 0xffffff,
    materialOpacity: 1.0,

    cameraDistance: 10,
    cameraSpeed: 0.01,

    rotationSpeed: 0.01,

    ambientLightColor: 0xffffff,
    ambientLightStrength: 0.2,
    directionalLightColor: 0xddffff,
    directionalLightStrength: 0.85,

    meshWireframeOpacity: 0.25,

    planeWidth: 30,
    planeHeight: 30,
    planeWidthSegments: 10,
    planeHeightSegments: 10,
    planeColor: 0x39383c,
    planeOpacity: 0,
};

const canvas = document.getElementById("3d-viewer-canvas");
const icosphereButton = document.getElementById('icosphere-button');
const cubeButton = document.getElementById('cube-button');
const skullButton = document.getElementById('skull-button');
const show_wireframe_input = document.getElementById('show-wireframe');
const show_texture_preview_input = document.getElementById('show-texture-preview');

let autoRotate = true;
let show_wireframe = false;
let show_texture_preview = false;

if (icosphereButton && cubeButton && skullButton && show_wireframe_input) {
    icosphereButton.addEventListener("click", function () {
        draw('/models/test.obj');
    });

    cubeButton.addEventListener("click", function () {
        draw('/models/cube.obj');
    });

    skullButton.addEventListener("click", function () {
        draw('/models/skull.obj');
    });

    show_wireframe_input.addEventListener('click', function () {
        show_wireframe = show_wireframe_input.checked;
    });

    show_texture_preview_input.addEventListener('click', function () {
        show_texture_preview = show_texture_preview_input.checked;
        const texture_preview = document.getElementById('texture-preview');
        // TODO Set visibility on page load since the browser likes to maintain state, do the same with the wireframe input
        if (show_texture_preview) {
            texture_preview.classList.remove('hidden');
        } else {
            texture_preview.classList.add('hidden');
        }
    });
}

async function draw(objFilePath = '') {

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
        directional.position.set(4, 3, 4);
        directional.lookAt(0,0,0);
        scene.add(directional);

        const obj_handler = new OBJHandler();
        let solidMesh, wireframe_lines, plane, plane_wireframe;
        let vertex_data = {};
        let face_data = { "vertices": {}, "uvs": {}, "normals": {} };
        let uv_data = {};
        let normal_data = {};
        let texture_map = '';

        if (objFilePath !== '') {
            let mtllib, usemtl;
            let filename = objFilePath.split('/')[2];
            const obj_file = await obj_handler.createFile(objFilePath, filename, 'model/obj');
            [vertex_data, face_data, uv_data, normal_data, mtllib, usemtl] = await obj_handler.readObjFile(obj_file);

            if (mtllib.length > 0 && usemtl.length > 0) {
                const mtl_file = await obj_handler.createFile('/models/' + mtllib[0], mtllib[0], 'model/mtl');
                texture_map = await obj_handler.readMtlFile(mtl_file, usemtl[0]);
            }
        }

        function buildPlane() {
            // TODO Figure out if there's a way to make this not triangulated
            const geometry = new THREE.PlaneGeometry(
                CONFIG.planeWidth,
                CONFIG.planeHeight,
                CONFIG.planeWidthSegments,
                CONFIG.planeHeightSegments
            );

            const material = new THREE.MeshBasicMaterial({
                color: CONFIG.planeColor,
                opacity: CONFIG.planeOpacity,
                transparent: true,
            });

            plane = new THREE.Mesh(geometry, material);
            plane.position.set(0,-4,0);
            plane.rotateX(THREE.MathUtils.degToRad(-90));

            const wireframe = new THREE.WireframeGeometry(geometry);
            plane_wireframe = new THREE.LineSegments(wireframe);
            plane_wireframe.material.depthWrite = false;
            plane_wireframe.material.opacity = 0.25;
            plane_wireframe.material.transparent = true;
            plane_wireframe.position.set(0,-4,0);
            plane_wireframe.rotateX(THREE.MathUtils.degToRad(-90));
        }

        function buildMesh() {
            if (Object.keys(face_data.vertices).length === 0) {
                return;
            }

            let verts_arr = [];
            let uv_arr = [];
            let normal_arr = [];

            for (let i in face_data.vertices) {
                const face_vertex_indices = face_data.vertices[i];
                for (let j in face_vertex_indices) {
                    const index = face_vertex_indices[j];
                    verts_arr.push(vertex_data[index][0]); // x
                    verts_arr.push(vertex_data[index][1]); // y
                    verts_arr.push(vertex_data[index][2]); // z
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

            for (let i in face_data.normals) {
                const face_normal_indices = face_data.normals[i];
                for (let j in face_normal_indices) {
                    const index = face_normal_indices[j];
                    normal_arr.push(normal_data[index][0]); // x
                    normal_arr.push(normal_data[index][1]); // y
                    normal_arr.push(normal_data[index][2]); // z
                }
            }

            const verts = new Float32Array(verts_arr);
            const uvs = new Float32Array(uv_arr);
            const normals = new Float32Array(normal_arr);
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.BufferAttribute(verts, 3 ));
            geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
            geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
            const material = new THREE.MeshStandardMaterial({ color: CONFIG.materialColor });

            if (texture_map) {
                const textureLoader = new THREE.TextureLoader();
                material.map = textureLoader.load('/models/' + texture_map);
                const texture_preview = document.getElementById('texture-preview');
                texture_preview.src = '/models/' + texture_map;

                if (show_texture_preview) {
                    texture_preview.classList.remove('hidden');
                }
            }

            material.opacity = CONFIG.materialOpacity;
            material.transparent = CONFIG.materialOpacity < 1.0;
            solidMesh = new THREE.Mesh(geometry, material);

            const wireframe = new THREE.WireframeGeometry(geometry);
            wireframe_lines = new THREE.LineSegments(wireframe);
            // TODO Not sure this is working
            wireframe_lines.material.depthWrite = false;
            wireframe_lines.material.opacity = CONFIG.meshWireframeOpacity;
            wireframe_lines.material.transparent = true;
        }

        // TODO I'm all over the place with my camel space and snake case
        let lastMouseX = 0;
        let lastMouseY = 0;

        // TODO Add these event listeners to the window rather than the canvas (except for zoom)
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

            if (! plane) {
                buildPlane();
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

                if (show_wireframe) {
                    scene.add(wireframe_lines);
                } else {
                    scene.remove(wireframe_lines);
                }
            }

            if (plane) {
                scene.add(plane);
                scene.add(plane_wireframe);
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
