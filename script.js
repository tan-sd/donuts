import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as dat from "dat.gui";

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl');

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper();
axesHelper.visible = false;
scene.add(axesHelper);

gui
    .add(axesHelper, 'visible')
    .name('Axes')

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./textures/matcaps/4.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("Donuts", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 36,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 20,
    });
    textGeometry.center();

    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    gui
        .add(text, 'visible')
        .name('Text')

    console.time("donuts");

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

    for(let i = 0; i < 1000; i++) {
        const donut = new THREE.Mesh(donutGeometry, material);

        donut.position.x = (Math.random() - 0.5) * 20;
        donut.position.y = (Math.random() - 0.5) * 20;
        donut.position.z = (Math.random() - 0.5) * 20;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        donut.scale.set(scale, scale, scale);

        scene.add(donut);
    }
    console.timeEnd('donuts');
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

gui
    .add(controls, 'enableDamping')
    .name('Damping')

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();