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

// TODO Start using getCookie in our threejs code and get rid of this var since it will then be redundant
let config = structuredClone(CONFIG_DEFAULTS);

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
        config.fillColor = e.target.value;
        document.getElementById('fill-color-value').textContent = config.fillColor;
        setCookie('fill_color', hex2Str(config.fillColor));
        buildMesh();
    });

    document.getElementById('edge-color-input').addEventListener("change", function (e) {
        config.edgeColor = e.target.value;
        edgeUniforms.uEdgeColor.value.set(new THREE.Color(config.edgeColor));
        document.getElementById('edge-color-value').textContent = config.edgeColor;
        setCookie('edge_color', hex2Str(config.edgeColor));
        buildMesh();
    });

    document.getElementById('highlight-color-input').addEventListener("change", function (e) {
        config.highlightColor = e.target.value;
        edgeUniforms.uHighlightColor.value.set(new THREE.Color(config.highlightColor));
        document.getElementById('highlight-color-value').textContent = config.highlightColor;
        setCookie('highlight_color', hex2Str(config.highlightColor));
        buildMesh();
    });

    document.getElementById('fill-color-variation-slider').addEventListener("change", function (e) {
        config.fillColorVariation = e.target.value;
        document.getElementById('fill-color-variation-value').textContent = config.fillColorVariation;
        setCookie('fill_color_variation', config.fillColorVariation);
        buildMesh();
    });

    document.getElementById('pixel-size-slider').addEventListener("change", function (e) {
        config.pixelSize = e.target.value;
        document.getElementById('pixel-size-value').textContent = config.pixelSize;
        setCookie('pixel_size', config.pixelSize);
        buildMesh();
        onResize();
    });

    document.getElementById('jitter-amount-slider').addEventListener("change", function (e) {
        config.jitterAmount = e.target.value;
        document.getElementById('jitter-amount-value').textContent = config.jitterAmount;
        setCookie('jitter_amount', config.jitterAmount);
        buildMesh();
    });

    document.getElementById('x-segments-slider').addEventListener("change", function (e) {
        config.segmentsX = e.target.value;
        document.getElementById('x-segments-value').textContent = config.segmentsX;
        setCookie('segments_x', config.segmentsX);
        buildMesh();
    });

    document.getElementById('y-segments-slider').addEventListener("change", function (e) {
        config.segmentsY = e.target.value;
        document.getElementById('y-segments-value').textContent = config.segmentsY;
        setCookie('segments_y', config.segmentsY);
        buildMesh();
    });

    document.getElementById('base-relief-slider').addEventListener("change", function (e) {
        config.baseRelief = e.target.value;
        document.getElementById('base-relief-value').textContent = config.baseRelief;
        setCookie('base_relief', config.baseRelief);
        buildMesh();
    });

    document.getElementById('mouse-deform-radius-slider').addEventListener("change", function (e) {
        config.mouseDeformRadius = e.target.value;
        document.getElementById('mouse-deform-radius-value').textContent = config.mouseDeformRadius;
        setCookie('mouse_deform_radius', config.mouseDeformRadius);
        buildMesh();
    });

    document.getElementById('mouse-deform-strength-slider').addEventListener("change", function (e) {
        config.mouseDeformStrength = e.target.value;
        document.getElementById('mouse-deform-strength-value').textContent = config.mouseDeformStrength;
        setCookie('mouse_deform_strength', config.mouseDeformStrength);
        buildMesh();
    });

    document.getElementById('mouse-edge-radius-slider').addEventListener("change", function (e) {
        config.mouseEdgeRadius = e.target.value;
        edgeUniforms.uRadius.value = config.mouseEdgeRadius;
        document.getElementById('mouse-edge-radius-value').textContent = config.mouseEdgeRadius;
        setCookie('mouse_edge_radius', config.mouseEdgeRadius);
        buildMesh();
    });

    document.getElementById('camera-distance-slider').addEventListener("change", function (e) {
        config.cameraDistance = e.target.value;
        document.getElementById('camera-distance-value').textContent = config.cameraDistance;
        setCookie('camera_distance', config.cameraDistance);
        buildMesh();
    });

    document.getElementById('ambient-light-color-input').addEventListener("change", function (e) {
        config.ambientLightColor = e.target.value;
        document.getElementById('ambient-light-color-value').textContent = config.ambientLightColor;
        setCookie('ambient_light_color', hex2Str(config.ambientLightColor));
        updateAmbientLight();
    });

    document.getElementById('ambient-light-strength-slider').addEventListener("change", function (e) {
        config.ambientLightStrength = e.target.value;
        document.getElementById('ambient-light-strength-value').textContent = config.ambientLightStrength;
        setCookie('ambient_light_strength', config.ambientLightStrength);
        buildMesh();
        updateAmbientLight();
    });

    document.getElementById('directional-light-color-input').addEventListener("change", function (e) {
        config.directionalLightColor = e.target.value;
        document.getElementById('directional-light-color-value').textContent = config.directionalLightColor;
        setCookie('directional_light_color', hex2Str(config.directionalLightColor));
        updateAmbientLight();
    });

    document.getElementById('directional-light-strength-slider').addEventListener("change", function (e) {
        config.directionalLightStrength = e.target.value;
        document.getElementById('directional-light-strength-value').textContent = config.directionalLightStrength;
        // TODO Setting this seems to add this cookie var twice
        setCookie('directional_light_strength', config.directionalLightStrength);
        buildMesh();
        updateAmbientLight();
    });

    document.getElementById('reset').addEventListener("click", function (e) {
        config = structuredClone(CONFIG_DEFAULTS);

        edgeUniforms.uEdgeColor.value.set(new THREE.Color(str2Hex(config.edgeColor)));
        edgeUniforms.uHighlightColor.value.set(new THREE.Color(str2Hex(config.highlightColor)));
        edgeUniforms.uRadius.value = config.mouseEdgeRadius;

        setCookie('fill_color', hex2Str(config.fillColor));
        setCookie('edge_color', hex2Str(config.edgeColor));
        setCookie('highlight_color', hex2Str(config.highlightColor));
        setCookie('fill_color_variation', config.fillColorVariation);
        setCookie('pixel_size', config.pixelSize);
        setCookie('jitter_amount', config.jitterAmount);
        setCookie('segments_x', config.segmentsX);
        setCookie('segments_y', config.segmentsY);
        setCookie('base_relief', config.baseRelief);
        setCookie('mouse_deform_radius', config.mouseDeformRadius);
        setCookie('mouse_deform_strength', config.mouseDeformStrength);
        setCookie('mouse_edge_radius', config.mouseEdgeRadius);
        setCookie('camera_distance', config.cameraDistance);
        setCookie('ambient_light_color', hex2Str(config.ambientLightColor));
        setCookie('ambient_light_strength', config.ambientLightStrength);
        setCookie('directional_light_color', hex2Str(config.directionalLightColor));
        setCookie('directional_light_strength', config.directionalLightStrength);

        document.getElementById('fill-color-input').value = hex2Str(config.fillColor);
        document.getElementById('edge-color-input').value = hex2Str(config.edgeColor);
        document.getElementById('highlight-color-input').value = hex2Str(config.highlightColor);
        document.getElementById('fill-color-variation-slider').value = config.fillColorVariation;
        document.getElementById('pixel-size-slider').value = config.pixelSize;
        document.getElementById('jitter-amount-slider').value = config.jitterAmount;
        document.getElementById('x-segments-slider').value = config.segmentsX;
        document.getElementById('y-segments-slider').value = config.segmentsY;
        document.getElementById('base-relief-slider').value = config.baseRelief;
        document.getElementById('mouse-deform-radius-slider').value = config.mouseDeformRadius;
        document.getElementById('mouse-deform-strength-slider').value = config.mouseDeformStrength;
        document.getElementById('mouse-edge-radius-slider').value = config.mouseEdgeRadius;
        document.getElementById('camera-distance-slider').value = config.cameraDistance;
        document.getElementById('ambient-light-color-input').value = hex2Str(config.ambientLightColor);
        document.getElementById('ambient-light-strength-slider').value = config.ambientLightStrength;
        document.getElementById('directional-light-color-input').value = hex2Str(config.directionalLightColor);
        document.getElementById('directional-light-strength-slider').value = config.directionalLightStrength;

        document.getElementById('fill-color-value').textContent = hex2Str(config.fillColor);
        document.getElementById('edge-color-value').textContent = hex2Str(config.edgeColor);
        document.getElementById('highlight-color-value').textContent = hex2Str(config.highlightColor);
        document.getElementById('fill-color-variation-value').textContent = config.fillColorVariation;
        document.getElementById('pixel-size-value').textContent = config.pixelSize;
        document.getElementById('jitter-amount-value').textContent = config.jitterAmount;
        document.getElementById('x-segments-value').textContent = config.segmentsX;
        document.getElementById('y-segments-value').textContent = config.segmentsY;
        document.getElementById('base-relief-value').textContent = config.baseRelief;
        document.getElementById('mouse-deform-radius-value').textContent = config.mouseDeformRadius;
        document.getElementById('mouse-deform-strength-value').textContent = config.mouseDeformStrength;
        document.getElementById('mouse-edge-radius-value').textContent = config.mouseEdgeRadius;
        document.getElementById('camera-distance-value').textContent = config.cameraDistance;
        document.getElementById('ambient-light-color-value').textContent = hex2Str(config.ambientLightColor);
        document.getElementById('ambient-light-strength-value').textContent = config.ambientLightStrength;
        document.getElementById('directional-light-color-value').textContent = hex2Str(config.directionalLightColor);
        document.getElementById('directional-light-strength-value').textContent = config.directionalLightStrength;

        buildMesh();
        onResize();
        updateAmbientLight();
    });

    const canvas = document.getElementById("bg-canvas");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(str2Hex(getCookie('fill_color')));

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, config.cameraDistance);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(config.ambientLightColor, config.ambientLightStrength);
    const directional = new THREE.DirectionalLight(config.directionalLightColor, config.directionalLightStrength);

    function getPlaneSize() {
        const aspect = window.innerWidth / window.innerHeight;
        const vFov = (camera.fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFov / 2) * config.cameraDistance;
        const visibleWidth = visibleHeight * aspect;
        const overscan = 1.3;
        return { width: visibleWidth * overscan, height: visibleHeight * overscan };
    }

    let planeGeo, solidMesh, edgeMesh;
    let originalPositions;
    let currentPositions;

    const edgeUniforms = {
        uEdgeColor: { value: new THREE.Color(config.edgeColor) },
        uHighlightColor: { value: new THREE.Color(config.highlightColor) },
        uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
        uRadius: { value: config.mouseEdgeRadius },
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
            config.segmentsX,
            config.segmentsY
        );

        const pos = geo.attributes.position;
        const cellW = width / config.segmentsX;
        const cellH = height / config.segmentsY;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);

            const onEdgeX = Math.abs(x) >= width / 2 - 1e-4;
            const onEdgeY = Math.abs(y) >= height / 2 - 1e-4;

            let nx = x;
            let ny = y;
            let nz = (Math.random() - 0.5) * config.baseRelief;

            if (!onEdgeX) nx += (Math.random() - 0.5) * cellW * config.jitterAmount;
            if (!onEdgeY) ny += (Math.random() - 0.5) * cellH * config.jitterAmount;
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
            const variation = (Math.random() - 0.5) * config.fillColorVariation;
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
        ambient.color.set(config.ambientLightColor);
        ambient.intensity = config.ambientLightStrength;
        scene.add(ambient);
        directional.position.set(3, 5, 6);
        scene.remove(directional);
        directional.color.set(config.directionalLightColor);
        directional.intensity = config.directionalLightStrength;
        scene.add(directional);
    }

    updateAmbientLight();

    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const lowW = Math.max(1, Math.floor(w / config.pixelSize));
        const lowH = Math.max(1, Math.floor(h / config.pixelSize));

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
        const radius = config.mouseDeformRadius;
        const strength = config.mouseDeformStrength;

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
        setCookie('fill_color', hex2Str(config.fillColor));
        setCookie('edge_color', hex2Str(config.edgeColor));
        setCookie('highlight_color', hex2Str(config.highlightColor));
        setCookie('fill_color_variation', config.fillColorVariation);
        setCookie('pixel_size', config.pixelSize);
        setCookie('segments_x', config.segmentsX);
        setCookie('segments_y', config.segmentsY);
        setCookie('jitter_amount', config.jitterAmount);
        setCookie('base_relief', config.baseRelief);
        setCookie('mouse_deform_radius', config.mouseDeformRadius);
        setCookie('mouse_deform_strength', config.mouseDeformStrength);
        setCookie('mouse_edge_radius', config.mouseEdgeRadius);
        setCookie('camera_distance', config.cameraDistance);
        setCookie('ambient_light_color', hex2Str(config.ambientLightColor));
        setCookie('ambient_light_strength', config.ambientLightStrength);
        setCookie('directional_light_color', hex2Str(config.directionalLightColor));
        setCookie('directional_light_strength', config.directionalLightStrength);
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
