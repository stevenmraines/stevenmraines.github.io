const THREE = require('three');
const OBJHandler = require('./OBJHandler.js');

const CONFIG = {
    canvasWidth: 900,
    canvasHeight: 600,
    transitionDuration: 350,

    fillColor: 0x2c2a30,

    materialColor: 0x999999,
    materialOpacity: 1.0,

    cameraDistance: 10,
    cameraSpeed: 0.01,

    rotationSpeed: 0.01,

    ambientLightColor: 0xffffff,
    ambientLightStrength: 0.2,
    directionalLightColor: 0xddffff,
    directionalLightStrength: 0.85,

    meshWireframeOpacity: 0.5,

    planeWidth: 30,
    planeHeight: 30,
    planeWidthSegments: 10,
    planeHeightSegments: 10,
    planeColor: 0x39383c,
    planeOpacity: 0,
};

let current_obj_file_path = '';
let current_rotation = new THREE.Vector3(0,0,0);
let current_scale = new THREE.Vector3(1,1,1);
let renderer;

const canvas = document.getElementById("model-viewer-canvas");
const overlay = document.getElementById('model-viewer-overlay');
const overlay_content = document.getElementById('model-viewer-overlay-content');
const cards_container = document.getElementById('cards-container');
const show_wireframe_input = document.getElementById('show-wireframe');
const show_texture_preview_input = document.getElementById('show-texture-preview');
const texture_filtering_input = document.getElementById('texture-filtering');
const texture_placeholder = document.getElementById('texture-placeholder');
const texture_image = document.getElementById('texture-image');
const model_viewer_close = document.getElementById('model-viewer-close');

let autoRotate = true;
let show_wireframe = false;
let show_texture_preview = false;
let filter_texture = false;

if (show_wireframe_input) {
    const obj_buttons = document.getElementsByClassName('load-obj-button');

    for (let obj_button of obj_buttons) {
        const obj_filename = obj_button.dataset.filename;
        let rx = 0;
        let ry = 0;
        let rz = 0;
        let sx = 1;
        let sy = 1;
        let sz = 1;

        if (obj_button.dataset.rotation) {
            [rx, ry, rz] = obj_button.dataset.rotation.split('/').map(parseFloat);
        }

        if (obj_button.dataset.scale) {
            [sx, sy, sz] = obj_button.dataset.scale.split('/').map(parseFloat);
        }

        const rotation = new THREE.Vector3(rx, ry, rz);
        const scale = new THREE.Vector3(sx, sy, sz);

        obj_button.addEventListener('click', function () {
            draw('/models/' + obj_filename, rotation, scale);
        });
    }

    show_wireframe_input.addEventListener('click', function () {
        show_wireframe = show_wireframe_input.checked;
    });

    show_texture_preview_input.addEventListener('click', function () {
        show_texture_preview = show_texture_preview_input.checked;
        // TODO Set visibility on page load since the browser likes to maintain state, do the same with the wireframe input
        const hasTexture = ! texture_image.src.endsWith('#');
        texture_image.style.display = show_texture_preview && hasTexture ? 'block' : 'none';
        texture_placeholder.style.display = show_texture_preview && ! hasTexture ? 'block' : 'none';
    });

    texture_filtering_input.addEventListener('click', function () {
        filter_texture = texture_filtering_input.checked;
        if (current_obj_file_path) {
            draw(current_obj_file_path, current_rotation, current_scale);
        }
    });

    model_viewer_close.addEventListener('click', collapse3DViewer);
}

async function draw(objFilePath = '', rotation = new THREE.Vector3(0,0,0), scale = new THREE.Vector3(1,1,1)) {

    current_obj_file_path = objFilePath;
    current_rotation = rotation;
    current_scale = scale;

    try {

        expand3DViewer();

        autoRotate = true;

        if (! renderer) {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        }

        renderer.dispose();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(CONFIG.fillColor);

        renderer.setSize(CONFIG.canvasWidth, CONFIG.canvasHeight, false);
        let aspect = CONFIG.canvasWidth / CONFIG.canvasHeight;
        const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
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
        let subdir = '';
        let texture_map = '';

        if (objFilePath !== '') {
            let mtllib, usemtl;
            subdir = objFilePath.split('/')[2];
            let filename = objFilePath.split('/')[3];
            const obj_file = await obj_handler.createFile(objFilePath, filename, 'model/obj');
            [vertex_data, face_data, uv_data, normal_data, mtllib, usemtl] = await obj_handler.readObjFile(obj_file);

            if (mtllib.length > 0 && usemtl.length > 0) {
                const mtl_file = await obj_handler.createFile('/models/' + subdir + '/' + mtllib[0], mtllib[0], 'model/mtl');
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
            geometry.rotateX(THREE.MathUtils.degToRad(rotation.x));
            geometry.rotateY(THREE.MathUtils.degToRad(rotation.y));
            geometry.rotateZ(THREE.MathUtils.degToRad(rotation.z));
            geometry.scale(scale.x, scale.y, scale.z);
            const material = new THREE.MeshStandardMaterial({});

            if (texture_map) {
                const textureLoader = new THREE.TextureLoader();
                const texture = textureLoader.load('/models/' + subdir + '/' + texture_map);

                if (! filter_texture) {
                    texture.magFilter = THREE.NearestFilter;
                    texture.minFilter = THREE.NearestFilter;
                }

                material.map = texture;
                texture_image.src = '/models/' + subdir + '/' + texture_map;
            } else {
                texture_image.src = '#';
                material.color.setHex(CONFIG.materialColor);
            }

            const hasTexture = ! texture_image.src.endsWith('#');
            texture_image.style.display = show_texture_preview && hasTexture ? 'block' : 'none';
            texture_placeholder.style.display = show_texture_preview && ! hasTexture ? 'block' : 'none';

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

function expand3DViewer() {
    cards_container.classList.remove('flex-row');
    cards_container.classList.add('flex-col');

    canvas.classList.remove('viewer-w-collapsed');
    canvas.classList.add('viewer-w-expanded');
    // TODO Figure out what works better, these classes, or just hard-coding the widht and height
    canvas.style.width = '900px';

    setTimeout(function () {
        // canvas.classList.remove('viewer-h-collapsed');
        // canvas.classList.add('viewer-h-expanded');
        canvas.style.height = '600px';

        setTimeout(function () {
            overlay.classList.remove('viewer-w-collapsed');
            overlay.classList.remove('viewer-h-collapsed');
            overlay.classList.add('viewer-w-expanded');
            overlay.classList.add('viewer-h-expanded');

            overlay_content.classList.remove('viewer-w-collapsed');
            overlay_content.classList.remove('viewer-h-collapsed');
            overlay_content.classList.add('viewer-w-expanded');
            overlay_content.classList.add('viewer-h-expanded');

            overlay.style.display = 'block';
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);
}

function collapse3DViewer() {
    overlay.style.display = 'none';

    canvas.classList.add('viewer-h-collapsed');
    canvas.classList.remove('viewer-h-expanded');

    overlay.classList.add('viewer-h-collapsed');
    overlay.classList.add('viewer-w-collapsed');
    overlay.classList.remove('viewer-h-expanded');
    overlay.classList.remove('viewer-w-expanded');

    overlay_content.classList.add('viewer-h-collapsed');
    overlay_content.classList.add('viewer-w-collapsed');
    overlay_content.classList.remove('viewer-h-expanded');
    overlay_content.classList.remove('viewer-w-expanded');

    canvas.style.height = '0px';

    setTimeout(function () {
        canvas.classList.add('viewer-w-collapsed');
        canvas.classList.remove('viewer-w-expanded');

        // TODO Make sure this is all that is needed to stop rendering the viewer
        renderer.dispose();
        canvas.style.width = '0px';

        setTimeout(function () {
            cards_container.classList.add('flex-row');
            cards_container.classList.remove('flex-col');
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);

}
