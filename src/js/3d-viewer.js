import * as THREE from 'three';
import OBJHandler from './OBJHandler.js';
import { getCookie, setCookie, parseBoolean } from './util';
import {max} from "three/nodes";

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

let autoRotate = true;
let current_obj_file_path = '';
let current_rotation = new THREE.Vector3(0,0,0);
let current_scale = new THREE.Vector3(1,1,1);
let current_position = new THREE.Vector3(0,0,0);
let current_texture_image = 0;
let renderer;

const canvas = document.getElementById("model-viewer-canvas");
const overlay = document.getElementById('model-viewer-overlay');
const overlay_content = document.getElementById('model-viewer-overlay-content');
const cards_container = document.getElementById('cards-container');
const show_wireframe_input = document.getElementById('show-wireframe');
const show_texture_preview_input = document.getElementById('show-texture-preview');
const texture_filtering_input = document.getElementById('texture-filtering');
const texture_placeholder = document.getElementById('texture-placeholder');
const texture_preview_window = document.getElementById('texture-preview-window');
const texture_filename = document.getElementById('texture-filename');
const texture_image_container = document.getElementById('texture-image-container');
const prev_texture_button = document.getElementById('prev-texture');
const next_texture_button = document.getElementById('next-texture');
const model_viewer_close = document.getElementById('model-viewer-close');
const vert_count_element = document.getElementById('vert-count');
const tri_count_element = document.getElementById('tri-count');
const obj_buttons = document.getElementsByClassName('load-obj-button');

for (let obj_button of obj_buttons) {
    const obj_filename = obj_button.dataset.filename;
    let rx = 0;
    let ry = 0;
    let rz = 0;
    let sx = 1;
    let sy = 1;
    let sz = 1;
    let px = 0;
    let py = 0;
    let pz = 0;

    if (obj_button.dataset.rotation) {
        [rx, ry, rz] = obj_button.dataset.rotation.split('/').map(parseFloat);
    }

    if (obj_button.dataset.scale) {
        [sx, sy, sz] = obj_button.dataset.scale.split('/').map(parseFloat);
    }

    if (obj_button.dataset.position) {
        [px, py, pz] = obj_button.dataset.position.split('/').map(parseFloat);
    }

    const rotation = new THREE.Vector3(rx, ry, rz);
    const scale = new THREE.Vector3(sx, sy, sz);
    const position = new THREE.Vector3(px, py, pz);

    obj_button.addEventListener('click', function () {
        draw('/models/' + obj_filename, rotation, scale, position);
    });
}

show_wireframe_input.checked = parseBoolean(getCookie('showWireframe', false));

show_wireframe_input.addEventListener('click', function () {
    setCookie('showWireframe', show_wireframe_input.checked);
});

show_texture_preview_input.checked = parseBoolean(getCookie('showTexturePreview', false));

show_texture_preview_input.addEventListener('click', function () {
    setCookie('showTexturePreview', show_texture_preview_input.checked);
    const texture_images = texture_image_container.children;
    const hasTexture = texture_images.length && ! texture_images[0].src.endsWith('#');
    texture_preview_window.style.display = parseBoolean(getCookie('showTexturePreview', false)) && hasTexture ? 'block' : 'none';
    texture_placeholder.style.display = parseBoolean(getCookie('showTexturePreview', false)) && ! hasTexture ? 'block' : 'none';
});

texture_filtering_input.checked = parseBoolean(getCookie('filterTexture', false));

texture_filtering_input.addEventListener('click', function () {
    setCookie('filterTexture', texture_filtering_input.checked);
    if (current_obj_file_path) {
        draw(current_obj_file_path, current_rotation, current_scale, current_position);
    }
});

model_viewer_close.addEventListener('click', collapse3DViewer);

prev_texture_button.addEventListener('click', function () {
    current_texture_image = Math.max(current_texture_image - 1, 0);
    const image = texture_image_container.children[current_texture_image];
    for (let child of texture_image_container.children) {
        child.style.display = 'none';
    }
    // TODO Issue when clicking on spidey: "TypeError: can't access property "style", i is undefined"
    image.style.display = 'inline';
    texture_filename.innerText = image.dataset.filename;
});

next_texture_button.addEventListener('click', function () {
    current_texture_image = Math.min(current_texture_image + 1, texture_image_container.children.length - 1);
    const image = texture_image_container.children[current_texture_image];
    for (let child of texture_image_container.children) {
        child.style.display = 'none';
    }
    image.style.display = 'inline';
    texture_filename.innerText = image.dataset.filename;
});

async function draw(objFilePath = '', rotation = new THREE.Vector3(0,0,0), scale = new THREE.Vector3(1,1,1), position = new THREE.Vector3(0,0,0)) {

    current_obj_file_path = objFilePath;
    current_rotation = rotation;
    current_scale = scale;
    current_position = position;

    try {

        expand3DViewer();

        autoRotate = true;

        texture_image_container.replaceChildren();

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
        let objects = {};
        let meshes = [];
        let mesh_wireframes = [];
        let plane, plane_wireframe;
        let subdir = '';
        let vert_count = 0;
        let tri_count = 0;

        if (objFilePath !== '') {
            subdir = objFilePath.split('/')[2];
            let filename = objFilePath.split('/')[3];
            const obj_file = await obj_handler.createFile(objFilePath, filename, 'model/obj');
            [objects, vert_count, tri_count] = await obj_handler.readObjFile(obj_file);
            vert_count_element.innerText = `Vertices: ${vert_count}`;
            tri_count_element.innerText = `Tris: ${tri_count}`;

            for (let object_name of Object.keys(objects)) {
                const mtllib = objects[object_name].mtllib;
                const mtl_data = objects[object_name].usemtl;
                if (mtllib.length > 0 && mtl_data.length > 0) {
                    for (let index in mtl_data) {
                        const mtl_name = mtl_data[index].material;
                        const mtl_file = await obj_handler.createFile('/models/' + subdir + '/' + mtllib[0], mtllib[0], 'model/mtl');
                        if (! Object.hasOwn(objects[object_name], 'textures')) {
                            objects[object_name].textures = [];
                        }
                        objects[object_name].textures.push({
                            'map': await obj_handler.readMtlFile(mtl_file, mtl_name),
                            'faces': mtl_data[index].faces,
                        });
                    }
                }
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

        function buildMeshes() {
            let counter = 0;

            for (let object_name of Object.keys(objects)) {
                const object = objects[object_name];

                if (Object.keys(object.f.vertices).length === 0) {
                    return;
                }

                let verts_arr = [];
                let uv_arr = [];
                let normal_arr = [];
                let face_vertex_groups = {};
                let start = 0;
                let length = 0;
                let previous_texture, current_texture;

                // i == the face index
                for (let i in object.f.vertices) {
                    // face_vertex_indices == the indices of the vertices that make up the face at index i
                    const face_vertex_indices = object.f.vertices[i];
                    for (let j in face_vertex_indices) {
                        const index = face_vertex_indices[j];
                        verts_arr.push(object.v[index][0]); // x
                        verts_arr.push(object.v[index][1]); // y
                        verts_arr.push(object.v[index][2]); // z
                        length++;
                    }
                    if (object.textures) {
                        current_texture = object.textures.find((t) => t.faces.includes(parseInt(i)));
                        /*
                         * What we need is just two numbers per material/texture:
                         * where in the buffer does this material's faces start,
                         * and how many vertices does it span?
                         */
                        // TODO There are at least 3 tris on the dc17 model that are missing textures, but everything else looks good
                        // TODO There are some tris messed up on the lightsabers as well
                        face_vertex_groups[current_texture.map] = { start, length };
                        // TODO I suppose this won't work if a material has just one triangular face, but we'll cross that bridge when we come to it I guess
                        if (previous_texture && current_texture !== previous_texture) {
                            start += length;
                            length = 0;
                        }
                        previous_texture = current_texture;
                    }
                }

                for (let i in object.f.uvs) {
                    const face_uv_indices = object.f.uvs[i];
                    for (let j in face_uv_indices) {
                        const index = face_uv_indices[j];
                        uv_arr.push(object.vt[index][0]); // u
                        uv_arr.push(object.vt[index][1]); // v
                    }
                }

                for (let i in object.f.normals) {
                    const face_normal_indices = object.f.normals[i];
                    for (let j in face_normal_indices) {
                        const index = face_normal_indices[j];
                        normal_arr.push(object.vn[index][0]); // x
                        normal_arr.push(object.vn[index][1]); // y
                        normal_arr.push(object.vn[index][2]); // z
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
                geometry.translate(position.x, position.y, position.z);
                geometry.clearGroups();
                const materials = [];

                let texture_counter = 0;

                if (object.textures) {
                    for (let texture of object.textures) {
                        const material = new THREE.MeshStandardMaterial({});
                        texture_preview_window.style.display = 'block';
                        texture_placeholder.style.display = 'none';
                        const texture_image = document.createElement('img');
                        texture_image.style.display = 'none';
                        if (counter === 0) {
                            texture_image.style.display = 'inline';
                            texture_filename.innerText = texture.map;
                        }
                        texture_image_container.appendChild(texture_image);

                        const textureLoader = new THREE.TextureLoader();
                        const loaded_texture = textureLoader.load('/models/' + subdir + '/' + texture.map);

                        if (! parseBoolean(getCookie('filterTexture', false))) {
                            loaded_texture.magFilter = THREE.NearestFilter;
                            loaded_texture.minFilter = THREE.NearestFilter;
                        }

                        material.map = loaded_texture;
                        texture_image.src = '/models/' + subdir + '/' + texture.map;
                        texture_image.dataset.filename = texture.map;
                        texture_image.style.display = 'none';

                        if (texture_counter === 0) {
                            texture_image.style.display = 'inline';
                        }

                        const hasTexture = ! texture_image.src.endsWith('#');
                        texture_preview_window.style.display = parseBoolean(getCookie('showTexturePreview', false)) && hasTexture ? 'block' : 'none';
                        texture_placeholder.style.display = parseBoolean(getCookie('showTexturePreview', false)) && ! hasTexture ? 'block' : 'none';

                        material.opacity = CONFIG.materialOpacity;
                        material.transparent = true;
                        material.side = THREE.DoubleSide;
                        materials.push(material);

                        if (object.textures.length > 1 && face_vertex_groups[texture.map]) {
                            const start = face_vertex_groups[texture.map].start;
                            const length = face_vertex_groups[texture.map].length;
                            geometry.addGroup(start, length, materials.length - 1);
                        }

                        texture_counter++;
                    }
                } else {
                    texture_placeholder.style.display = 'block';
                    texture_preview_window.style.display = 'none';
                    const material = new THREE.MeshStandardMaterial({});
                    material.opacity = CONFIG.materialOpacity;
                    material.transparent = true;
                    material.color.setHex(CONFIG.materialColor);
                    materials.push(material);
                }

                if (object.textures && object.textures.length > 1) {
                    meshes.push(new THREE.Mesh(geometry, materials));
                } else {
                    meshes.push(new THREE.Mesh(geometry, materials[0]));
                }

                const wireframe = new THREE.WireframeGeometry(geometry);
                const wireframe_lines = new THREE.LineSegments(wireframe);
                wireframe_lines.material.depthWrite = false;
                wireframe_lines.material.opacity = CONFIG.meshWireframeOpacity;
                wireframe_lines.material.transparent = true;
                mesh_wireframes.push(wireframe_lines);

                counter++;
            }
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
                for (let i in meshes) {
                    autoRotate = false;
                    meshes[i].rotateY(CONFIG.rotationSpeed * directionX * diffX);
                    mesh_wireframes[i].rotateY(CONFIG.rotationSpeed * directionX * diffX);
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

            if (! meshes.length) {
                buildMeshes();
            }

            if (! plane) {
                buildPlane();
            }

            for (let i in meshes) {
                const mesh = meshes[i];
                const wireframe = mesh_wireframes[i];
                // TODO Not sure if needed?
                // scene.remove(mesh);
                // scene.remove(wireframe);
                // mesh.material.dispose();
                if (autoRotate) {
                    mesh.rotateY(THREE.MathUtils.degToRad(0.5));
                    wireframe.rotateY(THREE.MathUtils.degToRad(0.5));
                }

                scene.add(mesh);

                if (parseBoolean(getCookie('showWireframe', false))) {
                    scene.add(wireframe);
                } else {
                    scene.remove(wireframe);
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
