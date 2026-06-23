const THREE = require('three');

function showError(msg) {
    const box = document.getElementById("error-box");
    box.style.display = "block";
    box.textContent = "Error: " + msg;
    console.error(msg);
}
window.addEventListener("error", (e) => showError(e.message));

try {

    document.getElementById('fill-color-input').addEventListener("change", function (e) {
        CONFIG.fillColor = e.target.value;
        document.getElementById('fill-color-value').textContent = CONFIG.fillColor;
        buildMesh();
    });

    document.getElementById('edge-color-input').addEventListener("change", function (e) {
        CONFIG.edgeColor = e.target.value;
        edgeUniforms.uEdgeColor.value.set(new THREE.Color(CONFIG.edgeColor));
        document.getElementById('edge-color-value').textContent = CONFIG.edgeColor;
        buildMesh();
    });

    document.getElementById('highlight-color-input').addEventListener("change", function (e) {
        CONFIG.highlightColor = e.target.value;
        edgeUniforms.uHighlightColor.value.set(new THREE.Color(CONFIG.highlightColor));
        document.getElementById('highlight-color-value').textContent = CONFIG.highlightColor;
        buildMesh();
    });

    document.getElementById('fill-color-variation-slider').addEventListener("change", function (e) {
        CONFIG.fillColorVariation = e.target.value;
        document.getElementById('fill-color-variation-value').textContent = CONFIG.fillColorVariation;
        buildMesh();
    });

    document.getElementById('pixel-size-slider').addEventListener("change", function (e) {
        CONFIG.pixelSize = e.target.value;
        document.getElementById('pixel-size-value').textContent = CONFIG.pixelSize;
        buildMesh();
        onResize();
    });

    document.getElementById('jitter-amount-slider').addEventListener("change", function (e) {
        CONFIG.jitterAmount = e.target.value;
        document.getElementById('jitter-amount-value').textContent = CONFIG.jitterAmount;
        buildMesh();
    });

    document.getElementById('x-segments-slider').addEventListener("change", function (e) {
        CONFIG.segmentsX = e.target.value;
        document.getElementById('x-segments-value').textContent = CONFIG.segmentsX;
        buildMesh();
    });

    document.getElementById('y-segments-slider').addEventListener("change", function (e) {
        CONFIG.segmentsY = e.target.value;
        document.getElementById('y-segments-value').textContent = CONFIG.segmentsY;
        buildMesh();
    });

    document.getElementById('base-relief-slider').addEventListener("change", function (e) {
        CONFIG.baseRelief = e.target.value;
        document.getElementById('base-relief-value').textContent = CONFIG.baseRelief;
        buildMesh();
    });

    document.getElementById('mouse-deform-radius-slider').addEventListener("change", function (e) {
        CONFIG.mouseDeformRadius = e.target.value;
        document.getElementById('mouse-deform-radius-value').textContent = CONFIG.mouseDeformRadius;
        buildMesh();
    });

    document.getElementById('mouse-deform-strength-slider').addEventListener("change", function (e) {
        CONFIG.mouseDeformStrength = e.target.value;
        document.getElementById('mouse-deform-strength-value').textContent = CONFIG.mouseDeformStrength;
        buildMesh();
    });

    document.getElementById('mouse-edge-radius-slider').addEventListener("change", function (e) {
        CONFIG.mouseEdgeRadius = e.target.value;
        edgeUniforms.uRadius.value = CONFIG.mouseEdgeRadius;
        document.getElementById('mouse-edge-radius-value').textContent = CONFIG.mouseEdgeRadius;
        buildMesh();
    });

    document.getElementById('camera-distance-slider').addEventListener("change", function (e) {
        CONFIG.cameraDistance = e.target.value;
        document.getElementById('camera-distance-value').textContent = CONFIG.cameraDistance;
        buildMesh();
    });

    document.getElementById('ambient-light-color-input').addEventListener("change", function (e) {
        CONFIG.ambientLightColor = e.target.value;
        document.getElementById('ambient-light-color-value').textContent = CONFIG.ambientLightColor;
        updateAmbientLight();
    });

    document.getElementById('ambient-light-strength-slider').addEventListener("change", function (e) {
        CONFIG.ambientLightStrength = e.target.value;
        document.getElementById('ambient-light-strength-value').textContent = CONFIG.ambientLightStrength;
        buildMesh();
        updateAmbientLight();
    });

    document.getElementById('directional-light-color-input').addEventListener("change", function (e) {
        CONFIG.directionalLightColor = e.target.value;
        document.getElementById('directional-light-color-value').textContent = CONFIG.directionalLightColor;
        updateAmbientLight();
    });

    document.getElementById('directional-light-strength-slider').addEventListener("change", function (e) {
        CONFIG.directionalLightStrength = e.target.value;
        document.getElementById('directional-light-strength-value').textContent = CONFIG.directionalLightStrength;
        buildMesh();
        updateAmbientLight();
    });

    document.getElementById('reset').addEventListener("click", function (e) {
        CONFIG.fillColor = '#2c2a30';
        CONFIG.edgeColor = '#29b1a5';
        edgeUniforms.uEdgeColor.value.set(new THREE.Color(CONFIG.edgeColor));
        CONFIG.highlightColor = '#ec8000';
        edgeUniforms.uHighlightColor.value.set(new THREE.Color(CONFIG.highlightColor));
        CONFIG.fillColorVariation = 0.08;
        CONFIG.pixelSize = 0.75;
        CONFIG.segmentsX = 26;
        CONFIG.segmentsY = 16;
        CONFIG.jitterAmount = 0.85;
        CONFIG.baseRelief = 0.45;
        CONFIG.mouseDeformRadius = 3.75;
        CONFIG.mouseDeformStrength = 0.95;
        CONFIG.mouseEdgeRadius = 4.0;
        edgeUniforms.uRadius.value = CONFIG.mouseEdgeRadius;
        CONFIG.cameraDistance = 10;
        CONFIG.ambientLightColor = '#ffffff';
        CONFIG.ambientLightStrength = 0.3;
        CONFIG.directionalLightColor = '#ffffff';
        CONFIG.directionalLightStrength = 0.8;

        document.getElementById('fill-color-input').value = CONFIG.fillColor;
        document.getElementById('edge-color-input').value = CONFIG.edgeColor;
        document.getElementById('highlight-color-input').value = CONFIG.highlightColor;
        document.getElementById('fill-color-variation-slider').value = CONFIG.fillColorVariation;
        document.getElementById('pixel-size-slider').value = CONFIG.pixelSize;
        document.getElementById('jitter-amount-slider').value = CONFIG.jitterAmount;
        document.getElementById('x-segments-slider').value = CONFIG.segmentsX;
        document.getElementById('y-segments-slider').value = CONFIG.segmentsY;
        document.getElementById('base-relief-slider').value = CONFIG.baseRelief;
        document.getElementById('mouse-deform-radius-slider').value = CONFIG.mouseDeformRadius;
        document.getElementById('mouse-deform-strength-slider').value = CONFIG.mouseDeformStrength;
        document.getElementById('mouse-edge-radius-slider').value = CONFIG.mouseEdgeRadius;
        document.getElementById('camera-distance-slider').value = CONFIG.cameraDistance;
        document.getElementById('ambient-light-color-input').value = CONFIG.ambientLightColor;
        document.getElementById('ambient-light-strength-slider').value = CONFIG.ambientLightStrength;
        document.getElementById('directional-light-color-input').value = CONFIG.directionalLightColor;
        document.getElementById('directional-light-strength-slider').value = CONFIG.directionalLightStrength;

        document.getElementById('fill-color-value').textContent = CONFIG.fillColor;
        document.getElementById('edge-color-value').textContent = CONFIG.edgeColor;
        document.getElementById('highlight-color-value').textContent = CONFIG.highlightColor;
        document.getElementById('fill-color-variation-value').textContent = CONFIG.fillColorVariation;
        document.getElementById('pixel-size-value').textContent = CONFIG.pixelSize;
        document.getElementById('jitter-amount-value').textContent = CONFIG.jitterAmount;
        document.getElementById('x-segments-value').textContent = CONFIG.segmentsX;
        document.getElementById('y-segments-value').textContent = CONFIG.segmentsY;
        document.getElementById('base-relief-value').textContent = CONFIG.baseRelief;
        document.getElementById('mouse-deform-radius-value').textContent = CONFIG.mouseDeformRadius;
        document.getElementById('mouse-deform-strength-value').textContent = CONFIG.mouseDeformStrength;
        document.getElementById('mouse-edge-radius-value').textContent = CONFIG.mouseEdgeRadius;
        document.getElementById('camera-distance-value').textContent = CONFIG.cameraDistance;
        document.getElementById('ambient-light-color-value').textContent = CONFIG.ambientLightColor;
        document.getElementById('ambient-light-strength-value').textContent = CONFIG.ambientLightStrength;
        document.getElementById('directional-light-color-value').textContent = CONFIG.directionalLightColor;
        document.getElementById('directional-light-strength-value').textContent = CONFIG.directionalLightStrength;

        buildMesh();
        onResize();
        updateAmbientLight();
    })

    const CONFIG = {
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

    const canvas = document.getElementById("bg-canvas");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.fillColor);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, CONFIG.cameraDistance);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(CONFIG.ambientLightColor, CONFIG.ambientLightStrength);
    const directional = new THREE.DirectionalLight(CONFIG.directionalLightColor, CONFIG.directionalLightStrength);

    function getPlaneSize() {
        const aspect = window.innerWidth / window.innerHeight;
        const vFov = (camera.fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFov / 2) * CONFIG.cameraDistance;
        const visibleWidth = visibleHeight * aspect;
        const overscan = 1.3;
        return { width: visibleWidth * overscan, height: visibleHeight * overscan };
    }

    let planeGeo, solidMesh, edgeMesh;
    let originalPositions;
    let currentPositions;

    const edgeUniforms = {
        uEdgeColor: { value: new THREE.Color(CONFIG.edgeColor) },
        uHighlightColor: { value: new THREE.Color(CONFIG.highlightColor) },
        uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
        uRadius: { value: CONFIG.mouseEdgeRadius },
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
            CONFIG.segmentsX,
            CONFIG.segmentsY
        );

        const pos = geo.attributes.position;
        const cellW = width / CONFIG.segmentsX;
        const cellH = height / CONFIG.segmentsY;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);

            const onEdgeX = Math.abs(x) >= width / 2 - 1e-4;
            const onEdgeY = Math.abs(y) >= height / 2 - 1e-4;

            let nx = x;
            let ny = y;
            let nz = (Math.random() - 0.5) * CONFIG.baseRelief;

            if (!onEdgeX) nx += (Math.random() - 0.5) * cellW * CONFIG.jitterAmount;
            if (!onEdgeY) ny += (Math.random() - 0.5) * cellH * CONFIG.jitterAmount;
            if (onEdgeX || onEdgeY) nz *= 0.3;

            pos.setXYZ(i, nx, ny, nz);
        }

        geo = geo.toNonIndexed();
        geo.computeVertexNormals();

        /*
         * Give each triangle a slight random tint around the base fill
         * color so that the facets are visually distinguishable.
         */
        const baseColor = new THREE.Color(CONFIG.fillColor);
        const colors = new Float32Array(geo.attributes.position.count * 3);
        const triCount = geo.attributes.position.count / 3;
        for (let t = 0; t < triCount; t++) {
            const variation = (Math.random() - 0.5) * CONFIG.fillColorVariation;
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
        ambient.color.set(CONFIG.ambientLightColor);
        ambient.intensity = CONFIG.ambientLightStrength;
        scene.add(ambient);
        directional.position.set(3, 5, 6);
        scene.remove(directional);
        directional.color.set(CONFIG.directionalLightColor);
        directional.intensity = CONFIG.directionalLightStrength;
        scene.add(directional);
    }

    updateAmbientLight();

    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const lowW = Math.max(1, Math.floor(w / CONFIG.pixelSize));
        const lowH = Math.max(1, Math.floor(h / CONFIG.pixelSize));

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
        const radius = CONFIG.mouseDeformRadius;
        const strength = CONFIG.mouseDeformStrength;

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