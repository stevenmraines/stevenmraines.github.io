const THREE = require('three');

const CONFIG_DEFAULTS = {
    fillColor: 0x2c2a30,
    edgeColor: 0x29b1a5,
    highlightColor: 0xec8000,

    fillColorVariation: 0.08,

    pixelSize: 0.75,

    segmentsX: 26,
    segmentsY: 16,

    jitterAmount: 0.85,
    baseRelief: 0.45,

    mouseDeformRadius: 3.75,
    mouseDeformStrength: 0.95,
    mouseEdgeRadius: 4.0,

    cameraDistance: 10,

    ambientLightColor: 0xffffff,
    ambientLightStrength: 0.3,
    directionalLightColor: 0xffffff,
    directionalLightStrength: 0.8,
};

function showError(msg) {
    const box = document.getElementById("error-box");
    box.style.display = "block";
    box.textContent = "Error: " + msg;
    console.error(msg);
}

window.addEventListener("error", (e) => showError(e.message));

try {

    initCookies();

    document.getElementById('fill-color-input').addEventListener("change", function (e) {
        setCookie('fill_color', hex2Str(e.target.value));
        document.getElementById('fill-color-value').textContent = hex2Str(e.target.value);
        buildMesh();
    });

    document.getElementById('edge-color-input').addEventListener("change", function (e) {
        setCookie('edge_color', hex2Str(e.target.value));
        edgeUniforms.uEdgeColor.value.set(new THREE.Color(str2Hex(e.target.value)));
        document.getElementById('edge-color-value').textContent = hex2Str(e.target.value);
        buildMesh();
    });

    document.getElementById('highlight-color-input').addEventListener("change", function (e) {
        setCookie('highlight_color', hex2Str(e.target.value));
        edgeUniforms.uHighlightColor.value.set(new THREE.Color(str2Hex(e.target.value)));
        document.getElementById('highlight-color-value').textContent = hex2Str(e.target.value);
        buildMesh();
    });

    document.getElementById('fill-color-variation-slider').addEventListener("change", function (e) {
        setCookie('fill_color_variation', e.target.value);
        document.getElementById('fill-color-variation-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('pixel-size-slider').addEventListener("change", function (e) {
        setCookie('pixel_size', e.target.value);
        document.getElementById('pixel-size-value').textContent = e.target.value;
        buildMesh();
        onResize();
    });

    document.getElementById('jitter-amount-slider').addEventListener("change", function (e) {
        setCookie('jitter_amount', e.target.value);
        document.getElementById('jitter-amount-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('x-segments-slider').addEventListener("change", function (e) {
        setCookie('segments_x', e.target.value);
        document.getElementById('x-segments-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('y-segments-slider').addEventListener("change", function (e) {
        setCookie('segments_y', e.target.value);
        document.getElementById('y-segments-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('base-relief-slider').addEventListener("change", function (e) {
        setCookie('base_relief', e.target.value);
        document.getElementById('base-relief-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('mouse-deform-radius-slider').addEventListener("change", function (e) {
        setCookie('mouse_deform_radius', e.target.value);
        document.getElementById('mouse-deform-radius-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('mouse-deform-strength-slider').addEventListener("change", function (e) {
        setCookie('mouse_deform_strength', e.target.value);
        document.getElementById('mouse-deform-strength-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('mouse-edge-radius-slider').addEventListener("change", function (e) {
        setCookie('mouse_edge_radius', e.target.value);
        edgeUniforms.uRadius.value = parseFloat(e.target.value);
        document.getElementById('mouse-edge-radius-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('camera-distance-slider').addEventListener("change", function (e) {
        setCookie('camera_distance', e.target.value);
        document.getElementById('camera-distance-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('ambient-light-color-input').addEventListener("change", function (e) {
        setCookie('ambient_light_color', hex2Str(e.target.value));
        document.getElementById('ambient-light-color-value').textContent = hex2Str(e.target.value);
        updateAmbientLight();
    });

    document.getElementById('ambient-light-strength-slider').addEventListener("change", function (e) {
        setCookie('ambient_light_strength', e.target.value);
        document.getElementById('ambient-light-strength-value').textContent = e.target.value;
        buildMesh();
        updateAmbientLight();
    });

    document.getElementById('directional-light-color-input').addEventListener("change", function (e) {
        setCookie('directional_light_color', hex2Str(e.target.value));
        document.getElementById('directional-light-color-value').textContent = hex2Str(e.target.value);
        updateAmbientLight();
    });

    document.getElementById('directional-light-strength-slider').addEventListener("change", function (e) {
        setCookie('directional_light_strength', e.target.value);
        document.getElementById('directional-light-strength-value').textContent = e.target.value;
        buildMesh();
        updateAmbientLight();
    });

    document.getElementById('reset').addEventListener("click", function (e) {
        setCookie('fill_color', hex2Str(CONFIG_DEFAULTS.fillColor));
        setCookie('edge_color', hex2Str(CONFIG_DEFAULTS.edgeColor));
        setCookie('highlight_color', hex2Str(CONFIG_DEFAULTS.highlightColor));
        setCookie('fill_color_variation', CONFIG_DEFAULTS.fillColorVariation);
        setCookie('pixel_size', CONFIG_DEFAULTS.pixelSize);
        setCookie('jitter_amount', CONFIG_DEFAULTS.jitterAmount);
        setCookie('segments_x', CONFIG_DEFAULTS.segmentsX);
        setCookie('segments_y', CONFIG_DEFAULTS.segmentsY);
        setCookie('base_relief', CONFIG_DEFAULTS.baseRelief);
        setCookie('mouse_deform_radius', CONFIG_DEFAULTS.mouseDeformRadius);
        setCookie('mouse_deform_strength', CONFIG_DEFAULTS.mouseDeformStrength);
        setCookie('mouse_edge_radius', CONFIG_DEFAULTS.mouseEdgeRadius);
        setCookie('camera_distance', CONFIG_DEFAULTS.cameraDistance);
        setCookie('ambient_light_color', hex2Str(CONFIG_DEFAULTS.ambientLightColor));
        setCookie('ambient_light_strength', CONFIG_DEFAULTS.ambientLightStrength);
        setCookie('directional_light_color', hex2Str(CONFIG_DEFAULTS.directionalLightColor));
        setCookie('directional_light_strength', CONFIG_DEFAULTS.directionalLightStrength);

        edgeUniforms.uEdgeColor.value.set(new THREE.Color(str2Hex(getCookie('edge_color'))));
        edgeUniforms.uHighlightColor.value.set(new THREE.Color(str2Hex(getCookie('highlight_color'))));
        edgeUniforms.uRadius.value = parseFloat(getCookie('mouse_edge_radius'));

        document.getElementById('fill-color-input').value = hex2Str(CONFIG_DEFAULTS.fillColor);
        document.getElementById('edge-color-input').value = hex2Str(CONFIG_DEFAULTS.edgeColor);
        document.getElementById('highlight-color-input').value = hex2Str(CONFIG_DEFAULTS.highlightColor);
        document.getElementById('fill-color-variation-slider').value = CONFIG_DEFAULTS.fillColorVariation;
        document.getElementById('pixel-size-slider').value = CONFIG_DEFAULTS.pixelSize;
        document.getElementById('jitter-amount-slider').value = CONFIG_DEFAULTS.jitterAmount;
        document.getElementById('x-segments-slider').value = CONFIG_DEFAULTS.segmentsX;
        document.getElementById('y-segments-slider').value = CONFIG_DEFAULTS.segmentsY;
        document.getElementById('base-relief-slider').value = CONFIG_DEFAULTS.baseRelief;
        document.getElementById('mouse-deform-radius-slider').value = CONFIG_DEFAULTS.mouseDeformRadius;
        document.getElementById('mouse-deform-strength-slider').value = CONFIG_DEFAULTS.mouseDeformStrength;
        document.getElementById('mouse-edge-radius-slider').value = CONFIG_DEFAULTS.mouseEdgeRadius;
        document.getElementById('camera-distance-slider').value = CONFIG_DEFAULTS.cameraDistance;
        document.getElementById('ambient-light-color-input').value = hex2Str(CONFIG_DEFAULTS.ambientLightColor);
        document.getElementById('ambient-light-strength-slider').value = CONFIG_DEFAULTS.ambientLightStrength;
        document.getElementById('directional-light-color-input').value = hex2Str(CONFIG_DEFAULTS.directionalLightColor);
        document.getElementById('directional-light-strength-slider').value = CONFIG_DEFAULTS.directionalLightStrength;

        document.getElementById('fill-color-value').textContent = hex2Str(CONFIG_DEFAULTS.fillColor);
        document.getElementById('edge-color-value').textContent = hex2Str(CONFIG_DEFAULTS.edgeColor);
        document.getElementById('highlight-color-value').textContent = hex2Str(CONFIG_DEFAULTS.highlightColor);
        document.getElementById('fill-color-variation-value').textContent = CONFIG_DEFAULTS.fillColorVariation;
        document.getElementById('pixel-size-value').textContent = CONFIG_DEFAULTS.pixelSize;
        document.getElementById('jitter-amount-value').textContent = CONFIG_DEFAULTS.jitterAmount;
        document.getElementById('x-segments-value').textContent = CONFIG_DEFAULTS.segmentsX;
        document.getElementById('y-segments-value').textContent = CONFIG_DEFAULTS.segmentsY;
        document.getElementById('base-relief-value').textContent = CONFIG_DEFAULTS.baseRelief;
        document.getElementById('mouse-deform-radius-value').textContent = CONFIG_DEFAULTS.mouseDeformRadius;
        document.getElementById('mouse-deform-strength-value').textContent = CONFIG_DEFAULTS.mouseDeformStrength;
        document.getElementById('mouse-edge-radius-value').textContent = CONFIG_DEFAULTS.mouseEdgeRadius;
        document.getElementById('camera-distance-value').textContent = CONFIG_DEFAULTS.cameraDistance;
        document.getElementById('ambient-light-color-value').textContent = hex2Str(CONFIG_DEFAULTS.ambientLightColor);
        document.getElementById('ambient-light-strength-value').textContent = CONFIG_DEFAULTS.ambientLightStrength;
        document.getElementById('directional-light-color-value').textContent = hex2Str(CONFIG_DEFAULTS.directionalLightColor);
        document.getElementById('directional-light-strength-value').textContent = CONFIG_DEFAULTS.directionalLightStrength;

        renderer.dispose();
        buildMesh();
        onResize();
        updateAmbientLight();
    });

    const canvas = document.getElementById("bg-canvas");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(str2Hex(getCookie('fill_color')));

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, parseInt(getCookie('camera_distance')));
    // TODO Something strange going on with camera_distance, if you change it and then go to another page, it's visually not correct even though the cookie value is, resetting also seems broken until going to another page
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(getCookie('ambient_light_color'), parseFloat(getCookie('ambient_light_strength')));
    const directional = new THREE.DirectionalLight(getCookie('directional_light_color'), parseFloat(getCookie('directional_light_strength')));

    function getPlaneSize() {
        const aspect = window.innerWidth / window.innerHeight;
        const vFov = (camera.fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFov / 2) * parseInt(getCookie('camera_distance'));
        const visibleWidth = visibleHeight * aspect;
        const overscan = 1.3;
        return { width: visibleWidth * overscan, height: visibleHeight * overscan };
    }

    let planeGeo, solidMesh, edgeMesh;
    let originalPositions;
    let currentPositions;

    const edgeUniforms = {
        uEdgeColor: { value: new THREE.Color(str2Hex(getCookie('edge_color'))) },
        uHighlightColor: { value: new THREE.Color(str2Hex(getCookie('highlight_color'))) },
        uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
        uRadius: { value: parseFloat(getCookie('mouse_edge_radius')) },
    };

    function buildMesh() {
        if (solidMesh) {
            scene.remove(solidMesh);
            scene.remove(edgeMesh);
            planeGeo.dispose();
            solidMesh.material.dispose();
            edgeMesh.material.dispose();
        }

        const { width, height } = getPlaneSize();

        let geo = new THREE.PlaneGeometry(
            width,
            height,
            parseInt(getCookie('segments_x')),
            parseInt(getCookie('segments_y'))
        );

        const pos = geo.attributes.position;
        const cellW = width / parseInt(getCookie('segments_x'));
        const cellH = height / parseInt(getCookie('segments_y'));

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);

            const onEdgeX = Math.abs(x) >= width / 2 - 1e-4;
            const onEdgeY = Math.abs(y) >= height / 2 - 1e-4;

            let nx = x;
            let ny = y;
            let nz = (Math.random() - 0.5) * parseFloat(getCookie('base_relief'));

            if (!onEdgeX) nx += (Math.random() - 0.5) * cellW * parseFloat(getCookie('jitter_amount'));
            if (!onEdgeY) ny += (Math.random() - 0.5) * cellH * parseFloat(getCookie('jitter_amount'));
            if (onEdgeX || onEdgeY) nz *= 0.3;

            pos.setXYZ(i, nx, ny, nz);
        }

        geo = geo.toNonIndexed();
        geo.computeVertexNormals();

        /*
         * Give each triangle a slight random tint around the base fill
         * color so that the facets are visually distinguishable.
         */
        const baseColor = new THREE.Color(hex2Str(getCookie('fill_color')));
        const colors = new Float32Array(geo.attributes.position.count * 3);
        const triCount = geo.attributes.position.count / 3;
        for (let t = 0; t < triCount; t++) {
            const variation = (Math.random() - 0.5) * parseFloat(getCookie('fill_color_variation'));
            const c = baseColor.clone();
            c.r = THREE.MathUtils.clamp(c.r + variation, 0, 1);
            c.g = THREE.MathUtils.clamp(c.g + variation, 0, 1);
            c.b = THREE.MathUtils.clamp(c.b + variation, 0, 1);
            for (let v = 0; v < 3; v++) {
                const idx = (t * 3 + v) * 3;
                colors[idx] = c.r;
                colors[idx + 1] = c.g;
                colors[idx + 2] = c.b;
            }
        }
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        planeGeo = geo;

        originalPositions = Float32Array.from(planeGeo.attributes.position.array);
        currentPositions = Float32Array.from(originalPositions);

        const solidMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            vertexColors: true,
            flatShading: true,
            roughness: 0.9,
            metalness: 0.05,
        });
        solidMesh = new THREE.Mesh(planeGeo, solidMat);
        scene.add(solidMesh);

        const edgeMat = new THREE.ShaderMaterial({
            uniforms: edgeUniforms,
            wireframe: true,
            vertexShader: `
                  varying vec3 vWorldPos;
                  void main() {
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorldPos = worldPos.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
                `,
            fragmentShader: `
                  uniform vec3 uEdgeColor;
                  uniform vec3 uHighlightColor;
                  uniform vec3 uMouse;
                  uniform float uRadius;
                  varying vec3 vWorldPos;
                  void main() {
                    float d = distance(vWorldPos, uMouse);
                    float t = 1.0 - smoothstep(0.0, uRadius, d);
                    vec3 color = mix(uEdgeColor, uHighlightColor, t);
                    gl_FragColor = vec4(color, 1.0);
                  }
                `,
        });
        edgeMesh = new THREE.Mesh(planeGeo, edgeMat);
        scene.add(edgeMesh);
    }

    buildMesh();

    function updateAmbientLight() {
        scene.remove(ambient);
        ambient.color.set(str2Hex(getCookie('ambient_light_color')));
        ambient.intensity = parseFloat(getCookie('ambient_light_strength'));
        scene.add(ambient);
        directional.position.set(3, 5, 6);
        scene.remove(directional);
        directional.color.set(str2Hex(getCookie('directional_light_color')));
        directional.intensity = parseFloat(getCookie('directional_light_strength'));
        scene.add(directional);
    }

    updateAmbientLight();

    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const lowW = Math.max(1, Math.floor(w / parseFloat(getCookie('pixel_size'))));
        const lowH = Math.max(1, Math.floor(h / parseFloat(getCookie('pixel_size'))));

        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setSize(lowW, lowH, false);

        buildMesh();
    }

    window.addEventListener("resize", onResize);
    onResize();

    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(9999, 9999);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseWorld = new THREE.Vector3(9999, 9999, 9999);
    let mouseActive = false;

    function updateMouseWorld() {
        raycaster.setFromCamera(mouseNDC, camera);
        const hit = raycaster.ray.intersectPlane(groundPlane, mouseWorld);
        if (!hit) mouseWorld.set(9999, 9999, 9999);
    }

    window.addEventListener("mousemove", (e) => {
        mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouseActive = true;
        updateMouseWorld();
    });

    window.addEventListener("mouseleave", () => {
        mouseActive = false;
        mouseWorld.set(9999, 9999, 9999);
    });

    function updateDeformation() {
        const posAttr = planeGeo.attributes.position;
        const radius = parseFloat(getCookie('mouse_deform_radius'));
        const strength = parseFloat(getCookie('mouse_deform_strength'));

        for (let i = 0; i < posAttr.count; i++) {
            const ix = i * 3;
            const ox = originalPositions[ix];
            const oy = originalPositions[ix + 1];
            const oz = originalPositions[ix + 2];

            let targetZ = oz;

            if (mouseActive) {
                const dx = ox - mouseWorld.x;
                const dy = oy - mouseWorld.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < radius) {
                    const falloff = 1.0 - dist / radius;
                    const eased = falloff * falloff * (3 - 2 * falloff);
                    targetZ = oz + eased * strength;
                }
            }

            currentPositions[ix + 2] += (targetZ - currentPositions[ix + 2]) * 0.12;
            posAttr.setZ(i, currentPositions[ix + 2]);
        }

        posAttr.needsUpdate = true;
        planeGeo.computeVertexNormals();

        if (mouseActive) {
            edgeUniforms.uMouse.value.set(mouseWorld.x, mouseWorld.y, mouseWorld.z);
        } else {
            edgeUniforms.uMouse.value.set(9999, 9999, 9999);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        updateDeformation();
        renderer.render(scene, camera);
    }
    animate();

} catch (err) {
    showError(err.message + "\n" + (err.stack || ""));
}

function initCookies() {
    // Set default cookie values
    if (! getCookie('fill_color')) {
        setCookie('fill_color', hex2Str(CONFIG_DEFAULTS.fillColor));
        setCookie('edge_color', hex2Str(CONFIG_DEFAULTS.edgeColor));
        setCookie('highlight_color', hex2Str(CONFIG_DEFAULTS.highlightColor));
        setCookie('fill_color_variation', CONFIG_DEFAULTS.fillColorVariation);
        setCookie('pixel_size', CONFIG_DEFAULTS.pixelSize);
        setCookie('segments_x', CONFIG_DEFAULTS.segmentsX);
        setCookie('segments_y', CONFIG_DEFAULTS.segmentsY);
        setCookie('jitter_amount', CONFIG_DEFAULTS.jitterAmount);
        setCookie('base_relief', CONFIG_DEFAULTS.baseRelief);
        setCookie('mouse_deform_radius', CONFIG_DEFAULTS.mouseDeformRadius);
        setCookie('mouse_deform_strength', CONFIG_DEFAULTS.mouseDeformStrength);
        setCookie('mouse_edge_radius', CONFIG_DEFAULTS.mouseEdgeRadius);
        setCookie('camera_distance', CONFIG_DEFAULTS.cameraDistance);
        setCookie('ambient_light_color', hex2Str(CONFIG_DEFAULTS.ambientLightColor));
        setCookie('ambient_light_strength', CONFIG_DEFAULTS.ambientLightStrength);
        setCookie('directional_light_color', hex2Str(CONFIG_DEFAULTS.directionalLightColor));
        setCookie('directional_light_strength', CONFIG_DEFAULTS.directionalLightStrength);
    }
}

function hex2Str(hex) {
    return typeof hex === 'number' ? '#' + hex.toString(16).padStart(6, '0').toLowerCase() : hex;
}

function str2Hex(str) {
    return typeof str === 'string' ? parseInt(str.substring(1), 16) : str;
}

function getCookie(cookie, default_value = '') {
    const match = document.cookie
        .split('; ')
        .find((c) => c.startsWith(cookie + '='));

    return match ? match.slice(cookie.length + 1) : default_value;
}

function setCookie(cookie, value) {
    document.cookie = `${cookie}=${value}; Secure`;
}
