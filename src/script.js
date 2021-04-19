import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AxesHelper } from 'three';
import gsap from 'gsap';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Texture Loader
 */

const textureLoader = new THREE.TextureLoader();
const alpha = textureLoader.load('./textures/door/alpha.jpg');
const ambientOcclusion = textureLoader.load('./textures/door/ambientOcclusion.jpg');
const color = textureLoader.load('./textures/door/color.jpg');
const height = textureLoader.load('./textures/door/height.jpg');
const metalness = textureLoader.load('./textures/door/metalness.jpg');
const normal = textureLoader.load('./textures/door/normal.jpg');
const roughness = textureLoader.load('./textures/door/roughness.jpg');
const gradient = textureLoader.load('./textures/gradients/3.jpg');
const matcap = textureLoader.load('./textures/matcaps/5.png');

/**
 * Font Loader
 */
const textGroup = new THREE.Group();
const fontLoader = new THREE.FontLoader();
fontLoader.load('./fonts/Yellowtail_Regular.json', (font) => {
    console.log(font)
    const textGeometry = new THREE.TextBufferGeometry(
        'Jaagrav Seal',
        {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 9,
            bevelEnabled: true,
            bevelThickness:0.01,
            bevelSize: 0.014,
            bevelOffset: 0,
            bevelSegments: 12
        }
    )
    const text = new THREE.Mesh(
        textGeometry,
        material
    );

    textGeometry.computeBoundingBox();

    text.position.set(
        -textGeometry.boundingBox.max.x * 0.5,
        -textGeometry.boundingBox.max.y * 0.5,
        -textGeometry.boundingBox.max.z * 0.5
    )

    console.log(textGeometry.boundingBox)

    textGroup.add(text);
});

scene.add(textGroup);

/**
 * Objects
 */
const material = new THREE.MeshNormalMaterial();
material.side = THREE.DoubleSide;
material.shininess = 100;
// material.wireframe = true;
// material.matcap = matcap;

const othersGroup = new THREE.Group();

console.time("Other materials")

const boxGeometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
const donutGeometry = new THREE.TorusBufferGeometry(0.15, 0.1, 20, 23);

for(let i = 0 ; i < 500 ; i++) {
    const cube = new THREE.Mesh(
        boxGeometry,
        material
    );

    const donut = new THREE.Mesh(
        donutGeometry,
        material
    );

    cube.position.set(
        (Math.random() - 0.5) * 10, 
        (Math.random() - 0.5) * 10, 
        (Math.random() - 0.5) * 10
    )

    donut.position.set(
        (Math.random() - 0.5) * 50, 
        (Math.random() - 0.5) * 50, 
        (Math.random() - 0.5) * 50
    )

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    
    othersGroup.add(cube, donut);
}

console.timeEnd("Other materials")

scene.add(othersGroup);

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
    if(sizes.width < 600)
    camera.position.z = 4.5
    else
    camera.position.z = 2
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    
    gsap.to(textGroup.rotation, {
        duration: 10,
        x: textGroup.rotation.x - 1,
        y: textGroup.rotation.y - 1,
        z: textGroup.rotation.z - 1,
    })

    gsap.to(othersGroup.rotation, {
        duration: 10,
        x: othersGroup.rotation.x + 1,
        y: othersGroup.rotation.y + 1,
        z: othersGroup.rotation.z + 1,
    })
    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()