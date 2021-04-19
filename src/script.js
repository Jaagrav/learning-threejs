import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()
// Fog
const fog = new THREE.Fog(0x262837, 1, 15);
scene.fog = fog;
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Door Textures
const alphaDoorTexture = textureLoader.load('./textures/door/alpha.jpg');
const aODoorTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg');
const colorDoorTexture = textureLoader.load('./textures/door/color.jpg');
const heightDoorTexture = textureLoader.load('./textures/door/height.jpg');
const metalnessDoorTexture = textureLoader.load('./textures/door/metalness.jpg');
const normalDoorTexture = textureLoader.load('./textures/door/normal.jpg');
const roughnessDoorTexture = textureLoader.load('./textures/door/roughness.jpg');

//Wall Textures
const aOWallsTexture = textureLoader.load('./textures/bricks/ambientOcclusion.jpg')
const colorWallsTexture = textureLoader.load('./textures/bricks/color.jpg')
const normalWallsTexture = textureLoader.load('./textures/bricks/normal.jpg')
const roughnessWallsTexture = textureLoader.load('./textures/bricks/roughness.jpg')

//Grass Textures
const aOGrassTexture = textureLoader.load('./textures/grass/ambientOcclusion.jpg')
const colorGrassTexture = textureLoader.load('./textures/grass/color.jpg')
const normalGrassTexture = textureLoader.load('./textures/grass/normal.jpg')
const roughnessGrassTexture = textureLoader.load('./textures/grass/roughness.jpg')
aOGrassTexture.repeat.set(40, 40)
colorGrassTexture.repeat.set(40, 40)
normalGrassTexture.repeat.set(40, 40)
roughnessGrassTexture.repeat.set(40, 40)

aOGrassTexture.wrapS = THREE.RepeatWrapping;
colorGrassTexture.wrapS = THREE.RepeatWrapping;
normalGrassTexture.wrapS = THREE.RepeatWrapping;
roughnessGrassTexture.wrapS = THREE.RepeatWrapping;

aOGrassTexture.wrapT = THREE.RepeatWrapping;
colorGrassTexture.wrapT = THREE.RepeatWrapping;
normalGrassTexture.wrapT = THREE.RepeatWrapping;
roughnessGrassTexture.wrapT = THREE.RepeatWrapping;


/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: colorWallsTexture,
        transparent: true,
        aoMap: aOWallsTexture,
        normalMap: normalWallsTexture,
        roughnessMap: roughnessWallsTexture
    })
);
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.castShadow = true;
walls.position.y = 2.5/2;
house.add(walls);

//Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: 0xb35f45})
)
roof.position.y = 2.5 + (1 * 0.5)
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: colorDoorTexture,
        transparent: true,
        alphaMap: alphaDoorTexture,
        aoMap: aODoorTexture,
        displacementMap: heightDoorTexture,
        displacementScale: 0.1, 
        normalMap: normalDoorTexture,
        metalnessMap: metalnessDoorTexture,
        roughnessMap: roughnessDoorTexture
    })
)
door.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.set(0, 1, 2.01)
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({color: 0x89c894});

const bush1 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush1.scale.set(0.5,0.5,0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush2.scale.set(0.25,0.25,0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush3.scale.set(0.4,0.4,0.4);
bush3.position.set( -0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush4.scale.set(0.15,0.15,0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color: 0xb2b6b1});

for(let i = 0 ; i < 50 ; i++) {
    const angle = Math.random() * (Math.PI * 2)
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    )

    grave.position.set(x, 0.3, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;

    graves.add(grave);
}
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(200, 200),
    new THREE.MeshStandardMaterial({ 
        map: colorGrassTexture,
        aoMap: aOGrassTexture,
        normalMap: normalGrassTexture,
        roughnessMap: roughnessGrassTexture
     })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.castShadow = true;
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight)

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
ghost1.castShadow = true;
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
ghost2.castShadow = true;
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
ghost3.castShadow = true;
scene.add(ghost3)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 2
camera.position.z = 40
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x262837);
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock();
let clock2 = new THREE.Clock();
let resetClock2 = true;
let highestValue = 7.54193340353994;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if(camera.position.z < highestValue && resetClock2){
        clock2 = new THREE.Clock();
        resetClock2 = false;
    }

    if(camera.position.z < highestValue) {
        const elapsedTime2 = clock2.getElapsedTime()
        camera.position.set(
            Math.sin(elapsedTime2) * 9,
            2,
            (Math.cos(elapsedTime2)) * (7 + Math.sin(elapsedTime2) * 3)
        )
    }
    else {
        camera.position.z -= elapsedTime/10;
    }
    camera.lookAt(house.position);
    camera.rotation.z += Math.sin(elapsedTime);
    // console.log(Math.sin(elapsedTime) )


    // Update Ghosts
    ghost1.position.set(
        Math.sin(elapsedTime) * 4,
        Math.sin(elapsedTime * 3),
        Math.cos(elapsedTime) * 4
    )

    ghost2.position.set(
        Math.sin(elapsedTime) * 6,
        Math.sin(elapsedTime * 3),
        -Math.cos(elapsedTime) * 6
    )

    ghost3.position.set(
        Math.sin(elapsedTime * 0.5) * 8,
        Math.sin(elapsedTime * 3),
        Math.cos(elapsedTime * 0.5) * 8
    )

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()