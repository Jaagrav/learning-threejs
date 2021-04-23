import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from "dat.gui";
// import gsap from "gsap";

/**
 * Base
 */
// Canvas
let mouse, pos, headObj, parameters = {
    directionalLight1Color: 0x7178ff,
    directionalLight2Color: 0xd75757,
    pointLightColor: 0xc17cc1,
    backgroundColor: 0x4040c,
    showPointLight: true,
    enableOrbitControl: true
}, gui = new dat.GUI();

gui.hide();

const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/** 
 * Head
 */

const gltfLoader = new GLTFLoader();
gltfLoader.load("./models/head.gltf", async head => {
    headObj = head.scene;
    const headHolder = new THREE.Box3().setFromObject( headObj );

    const headHeight = -headHolder.max.y / 2;
    headObj.position.y = headHeight;

    scene.add(headObj);

    window.addEventListener('mousemove', clientMove)
    window.addEventListener('touchmove', clientMove)
})

/**
 * Fog
 */

const fog = new THREE.Fog(parameters.backgroundColor, 45, 55);
scene.fog = fog;

/**
 * Frozen Lights
 */

const directionalLight1 = new THREE.DirectionalLight(parameters.directionalLight1Color, 0.4);
directionalLight1.position.set(-32, -32, 0)
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(parameters.directionalLight2Color, 0.4);
directionalLight2.position.set(32, 32, 0)
scene.add(directionalLight2);

/**
 * Point Light
 */

const pointLight = new THREE.PointLight(parameters.pointLightColor, 1, 50, 1);
pointLight.position.set(0, 0, 14);
pointLight.visible = parameters.showPointLight;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 55
scene.add(camera)

/**
 * Fullscreen
 */

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

function clientMove(e) {
    if(!e?.touches?.length)
        mouse = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY / window.innerHeight) * 2 + 1
        };
    else
        mouse = {
            x: (e.touches[0].clientX / window.innerWidth) * 2 - 1,
            y: -(e.touches[0].clientY / window.innerHeight) * 2 + 1
        };

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z;
    pos = camera.position.clone().add(dir.multiplyScalar(distance));

    pointLight.position.y = pos.y;
    pointLight.position.x = Math.abs(pos.x) < 16 ? pos.x : pos.x < 0 ? -16 : 16;

    headObj.rotation.y = pos.x / 120;
    headObj.position.x = -pos.x / 10;
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(parameters.backgroundColor)


/**
 * Controls
 */

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = parameters.enableOrbitControl;
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update();
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

const colorsUpdated = () => {
    directionalLight1.color = new THREE.Color(parameters.directionalLight1Color);
    directionalLight2.color = new THREE.Color(parameters.directionalLight2Color);
    pointLight.color = new THREE.Color(parameters.pointLightColor);
    renderer.setClearColor(parameters.backgroundColor)
    pointLight.visible = parameters.showPointLight;
    fog.color = new THREE.Color(parameters.backgroundColor);
    scene.fog = fog;
    controls.enabled = parameters.enableOrbitControl;
}
gui.addColor(parameters, 'directionalLight1Color').onChange(colorsUpdated)
gui.addColor(parameters, 'directionalLight2Color').onChange(colorsUpdated)
gui.addColor(parameters, 'pointLightColor').onChange(colorsUpdated)
gui.addColor(parameters, 'backgroundColor').onChange(colorsUpdated)
gui.add(parameters, 'showPointLight').name("Show Point Light").onChange(colorsUpdated)
gui.add(parameters, 'enableOrbitControl').name("Enable Orbit Controls").onChange(colorsUpdated)