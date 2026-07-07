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
    if (box) {
        box.style.display = "block";
        box.textContent = "Error: " + msg;
    }
    console.error(msg);
}

window.addEventListener("error", (e) => showError(e.message));

try {

    initCookies();
    setInputs();

    document.getElementById('fill-color-input').addEventListener("change", function (e) {
        setCookie('fillColor', hex2Str(e.target.value));
        document.getElementById('fill-color-value').textContent = hex2Str(e.target.value);
        buildMesh();
    });

    document.getElementById('edge-color-input').addEventListener("change", function (e) {
        setCookie('edgeColor', hex2Str(e.target.value));
        edgeUniforms.uEdgeColor.value.set(new THREE.Color(str2Hex(e.target.value)));
        document.getElementById('edge-color-value').textContent = hex2Str(e.target.value);
        buildMesh();
    });

    document.getElementById('highlight-color-input').addEventListener("change", function (e) {
        setCookie('highlightColor', hex2Str(e.target.value));
        edgeUniforms.uHighlightColor.value.set(new THREE.Color(str2Hex(e.target.value)));
        document.getElementById('highlight-color-value').textContent = hex2Str(e.target.value);
        buildMesh();
    });

    document.getElementById('fill-color-variation-slider').addEventListener("change", function (e) {
        setCookie('fillColorVariation', e.target.value);
        document.getElementById('fill-color-variation-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('pixel-size-slider').addEventListener("change", function (e) {
        setCookie('pixelSize', e.target.value);
        document.getElementById('pixel-size-value').textContent = e.target.value;
        buildMesh();
        onResize();
    });

    document.getElementById('jitter-amount-slider').addEventListener("change", function (e) {
        setCookie('jitterAmount', e.target.value);
        document.getElementById('jitter-amount-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('x-segments-slider').addEventListener("change", function (e) {
        setCookie('segmentsX', e.target.value);
        document.getElementById('x-segments-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('y-segments-slider').addEventListener("change", function (e) {
        setCookie('segmentsY', e.target.value);
        document.getElementById('y-segments-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('base-relief-slider').addEventListener("change", function (e) {
        setCookie('baseRelief', e.target.value);
        document.getElementById('base-relief-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('mouse-deform-radius-slider').addEventListener("change", function (e) {
        setCookie('mouseDeformRadius', e.target.value);
        document.getElementById('mouse-deform-radius-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('mouse-deform-strength-slider').addEventListener("change", function (e) {
        setCookie('mouseDeformStrength', e.target.value);
        document.getElementById('mouse-deform-strength-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('mouse-edge-radius-slider').addEventListener("change", function (e) {
        setCookie('mouseEdgeRadius', e.target.value);
        edgeUniforms.uRadius.value = parseFloat(e.target.value);
        document.getElementById('mouse-edge-radius-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('camera-distance-slider').addEventListener("change", function (e) {
        setCookie('cameraDistance', e.target.value);
        document.getElementById('camera-distance-value').textContent = e.target.value;
        buildMesh();
    });

    document.getElementById('ambient-light-color-input').addEventListener("change", function (e) {
        setCookie('ambientLightColor', hex2Str(e.target.value));
        document.getElementById('ambient-light-color-value').textContent = hex2Str(e.target.value);
        updateAmbientLight();
    });

    document.getElementById('ambient-light-strength-slider').addEventListener("change", function (e) {
        setCookie('ambientLightStrength', e.target.value);
        document.getElementById('ambient-light-strength-value').textContent = e.target.value;
        buildMesh();
        updateAmbientLight();
    });

    document.getElementById('directional-light-color-input').addEventListener("change", function (e) {
        setCookie('directionalLightColor', hex2Str(e.target.value));
        document.getElementById('directional-light-color-value').textContent = hex2Str(e.target.value);
        updateAmbientLight();
    });

    document.getElementById('directional-light-strength-slider').addEventListener("change", function (e) {
        setCookie('directionalLightStrength', e.target.value);
        document.getElementById('directional-light-strength-value').textContent = e.target.value;
        buildMesh();
        updateAmbientLight();
    });

    document.getElementById('reset').addEventListener("click", function (e) {
        setCookie('fillColor', hex2Str(CONFIG_DEFAULTS.fillColor));
        setCookie('edgeColor', hex2Str(CONFIG_DEFAULTS.edgeColor));
        setCookie('highlightColor', hex2Str(CONFIG_DEFAULTS.highlightColor));
        setCookie('fillColorVariation', CONFIG_DEFAULTS.fillColorVariation);
        setCookie('pixelSize', CONFIG_DEFAULTS.pixelSize);
        setCookie('jitterAmount', CONFIG_DEFAULTS.jitterAmount);
        setCookie('segmentsX', CONFIG_DEFAULTS.segmentsX);
        setCookie('segmentsY', CONFIG_DEFAULTS.segmentsY);
        setCookie('baseRelief', CONFIG_DEFAULTS.baseRelief);
        setCookie('mouseDeformRadius', CONFIG_DEFAULTS.mouseDeformRadius);
        setCookie('mouseDeformStrength', CONFIG_DEFAULTS.mouseDeformStrength);
        setCookie('mouseEdgeRadius', CONFIG_DEFAULTS.mouseEdgeRadius);
        setCookie('cameraDistance', CONFIG_DEFAULTS.cameraDistance);
        setCookie('ambientLightColor', hex2Str(CONFIG_DEFAULTS.ambientLightColor));
        setCookie('ambientLightStrength', CONFIG_DEFAULTS.ambientLightStrength);
        setCookie('directionalLightColor', hex2Str(CONFIG_DEFAULTS.directionalLightColor));
        setCookie('directionalLightStrength', CONFIG_DEFAULTS.directionalLightStrength);

        edgeUniforms.uEdgeColor.value.set(new THREE.Color(str2Hex(getCookie('edgeColor'))));
        edgeUniforms.uHighlightColor.value.set(new THREE.Color(str2Hex(getCookie('highlightColor'))));
        edgeUniforms.uRadius.value = parseFloat(getCookie('mouseEdgeRadius'));

        resetInputs();
        buildMesh();
        onResize();
        updateAmbientLight();
    });

    const canvas = document.getElementById("bg-canvas");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(str2Hex(getCookie('fillColor')));

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, parseInt(getCookie('cameraDistance')));
    // TODO Something strange going on with cameraDistance, if you change it and then go to another page, it's visually not correct even though the cookie value is, resetting also seems broken until going to another page
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(getCookie('ambientLightColor'), parseFloat(getCookie('ambientLightStrength')));
    const directional = new THREE.DirectionalLight(getCookie('directionalLightColor'), parseFloat(getCookie('directionalLightStrength')));

    function getPlaneSize() {
        const aspect = window.innerWidth / window.innerHeight;
        const vFov = (camera.fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFov / 2) * parseInt(getCookie('cameraDistance'));
        const visibleWidth = visibleHeight * aspect;
        const overscan = 1.3;
        return { width: visibleWidth * overscan, height: visibleHeight * overscan };
    }

    let planeGeo, solidMesh, edgeMesh;
    let originalPositions;
    let currentPositions;

    const edgeUniforms = {
        uEdgeColor: { value: new THREE.Color(str2Hex(getCookie('edgeColor'))) },
        uHighlightColor: { value: new THREE.Color(str2Hex(getCookie('highlightColor'))) },
        uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
        uRadius: { value: parseFloat(getCookie('mouseEdgeRadius')) },
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
            parseInt(getCookie('segmentsX')),
            parseInt(getCookie('segmentsY'))
        );

        const pos = geo.attributes.position;
        const cellW = width / parseInt(getCookie('segmentsX'));
        const cellH = height / parseInt(getCookie('segmentsY'));

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);

            const onEdgeX = Math.abs(x) >= width / 2 - 1e-4;
            const onEdgeY = Math.abs(y) >= height / 2 - 1e-4;

            let nx = x;
            let ny = y;
            let nz = (Math.random() - 0.5) * parseFloat(getCookie('baseRelief'));

            if (!onEdgeX) nx += (Math.random() - 0.5) * cellW * parseFloat(getCookie('jitterAmount'));
            if (!onEdgeY) ny += (Math.random() - 0.5) * cellH * parseFloat(getCookie('jitterAmount'));
            if (onEdgeX || onEdgeY) nz *= 0.3;

            pos.setXYZ(i, nx, ny, nz);
        }

        geo = geo.toNonIndexed();
        geo.computeVertexNormals();

        /*
         * Give each triangle a slight random tint around the base fill
         * color so that the facets are visually distinguishable.
         */
        const baseColor = new THREE.Color(hex2Str(getCookie('fillColor')));
        const colors = new Float32Array(geo.attributes.position.count * 3);
        const triCount = geo.attributes.position.count / 3;
        for (let t = 0; t < triCount; t++) {
            const variation = (Math.random() - 0.5) * parseFloat(getCookie('fillColorVariation'));
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
        ambient.color.set(str2Hex(getCookie('ambientLightColor')));
        ambient.intensity = parseFloat(getCookie('ambientLightStrength'));
        scene.add(ambient);
        directional.position.set(3, 5, 6);
        scene.remove(directional);
        directional.color.set(str2Hex(getCookie('directionalLightColor')));
        directional.intensity = parseFloat(getCookie('directionalLightStrength'));
        scene.add(directional);
    }

    updateAmbientLight();

    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const lowW = Math.max(1, Math.floor(w / parseFloat(getCookie('pixelSize'))));
        const lowH = Math.max(1, Math.floor(h / parseFloat(getCookie('pixelSize'))));

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
        const radius = parseFloat(getCookie('mouseDeformRadius'));
        const strength = parseFloat(getCookie('mouseDeformStrength'));

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
    if (! getCookie('fillColor')) {
        setCookie('fillColor', hex2Str(CONFIG_DEFAULTS.fillColor));
        setCookie('edgeColor', hex2Str(CONFIG_DEFAULTS.edgeColor));
        setCookie('highlightColor', hex2Str(CONFIG_DEFAULTS.highlightColor));
        setCookie('fillColorVariation', CONFIG_DEFAULTS.fillColorVariation);
        setCookie('pixelSize', CONFIG_DEFAULTS.pixelSize);
        setCookie('segmentsX', CONFIG_DEFAULTS.segmentsX);
        setCookie('segmentsY', CONFIG_DEFAULTS.segmentsY);
        setCookie('jitterAmount', CONFIG_DEFAULTS.jitterAmount);
        setCookie('baseRelief', CONFIG_DEFAULTS.baseRelief);
        setCookie('mouseDeformRadius', CONFIG_DEFAULTS.mouseDeformRadius);
        setCookie('mouseDeformStrength', CONFIG_DEFAULTS.mouseDeformStrength);
        setCookie('mouseEdgeRadius', CONFIG_DEFAULTS.mouseEdgeRadius);
        setCookie('cameraDistance', CONFIG_DEFAULTS.cameraDistance);
        setCookie('ambientLightColor', hex2Str(CONFIG_DEFAULTS.ambientLightColor));
        setCookie('ambientLightStrength', CONFIG_DEFAULTS.ambientLightStrength);
        setCookie('directionalLightColor', hex2Str(CONFIG_DEFAULTS.directionalLightColor));
        setCookie('directionalLightStrength', CONFIG_DEFAULTS.directionalLightStrength);
    }
}

function setInputs() {
    document.getElementById('fill-color-input').value = hex2Str(getCookie('fillColor'));
    document.getElementById('edge-color-input').value = hex2Str(getCookie('edgeColor'));
    document.getElementById('highlight-color-input').value = hex2Str(getCookie('highlightColor'));
    document.getElementById('fill-color-variation-slider').value = getCookie('fillColorVariation');
    document.getElementById('pixel-size-slider').value = getCookie('pixelSize');
    document.getElementById('jitter-amount-slider').value = getCookie('jitterAmount');
    document.getElementById('x-segments-slider').value = getCookie('segmentsX');
    document.getElementById('y-segments-slider').value = getCookie('segmentsY');
    document.getElementById('base-relief-slider').value = getCookie('baseRelief');
    document.getElementById('mouse-deform-radius-slider').value = getCookie('mouseDeformRadius');
    document.getElementById('mouse-deform-strength-slider').value = getCookie('mouseDeformStrength');
    document.getElementById('mouse-edge-radius-slider').value = getCookie('mouseEdgeRadius');
    document.getElementById('camera-distance-slider').value = getCookie('cameraDistance');
    document.getElementById('ambient-light-color-input').value = hex2Str(getCookie('ambientLightColor'));
    document.getElementById('ambient-light-strength-slider').value = getCookie('ambientLightStrength');
    document.getElementById('directional-light-color-input').value = hex2Str(getCookie('directionalLightColor'));
    document.getElementById('directional-light-strength-slider').value = getCookie('directionalLightStrength');

    document.getElementById('fill-color-value').textContent = hex2Str(getCookie('fillColor'));
    document.getElementById('edge-color-value').textContent = hex2Str(getCookie('edgeColor'));
    document.getElementById('highlight-color-value').textContent = hex2Str(getCookie('highlightColor'));
    document.getElementById('fill-color-variation-value').textContent = getCookie('fillColorVariation');
    document.getElementById('pixel-size-value').textContent = getCookie('pixelSize');
    document.getElementById('jitter-amount-value').textContent = getCookie('jitterAmount');
    document.getElementById('x-segments-value').textContent = getCookie('segmentsX');
    document.getElementById('y-segments-value').textContent = getCookie('segmentsY');
    document.getElementById('base-relief-value').textContent = getCookie('baseRelief');
    document.getElementById('mouse-deform-radius-value').textContent = getCookie('mouseDeformRadius');
    document.getElementById('mouse-deform-strength-value').textContent = getCookie('mouseDeformStrength');
    document.getElementById('mouse-edge-radius-value').textContent = getCookie('mouseEdgeRadius');
    document.getElementById('camera-distance-value').textContent = getCookie('cameraDistance');
    document.getElementById('ambient-light-color-value').textContent = hex2Str(getCookie('ambientLightColor'));
    document.getElementById('ambient-light-strength-value').textContent = getCookie('ambientLightStrength');
    document.getElementById('directional-light-color-value').textContent = hex2Str(getCookie('directionalLightColor'));
    document.getElementById('directional-light-strength-value').textContent = getCookie('directionalLightStrength');
}

function resetInputs() {
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
}

function hex2Str(hex) {
    return typeof hex === 'number' ? '#' + hex.toString(16).padStart(6, '0').toLowerCase() : hex;
}

function str2Hex(str) {
    return typeof str === 'string' ? parseInt(str.substring(1), 16) : str;
}

// TODO Deduplicate this once we fix whatever is wrong with our bundling stuff (it's also in 3d-viewer.js)
function getCookie(cookie, default_value = '') {
    const match = document.cookie
        .split('; ')
        .find((c) => c.startsWith(cookie + '='));

    return match ? match.slice(cookie.length + 1) : default_value;
}

function setCookie(cookie, value) {
    document.cookie = `${cookie}=${value}; Secure`;
}
