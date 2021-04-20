import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GeometryUtils, WebGLMultisampleRenderTarget } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('./textures/particles/1.png')

/**
 * Particles
 */
const stars = new THREE.Group();
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    depthTest: false
})

const particles = new THREE.Points(
    particlesGeometry,
    particlesMaterial
    );

    
    stars.add(particles)
    // scene.add(stars)
    
    
    // Galaxy
    
    const parameters = {
        count: 100000,
        size: 0.01,
        radius: 5,
        branches: 3,
        spin: 1,
        randomness: 0.2,
        randomnessPower: 3,
        insideColor: "#ff6030",
        outsideColor: "#1b3984"
    }

    const galaxyHolder = new THREE.Group();

    let galaxyGeometry = null; 
    let galaxyMaterial = null; 
    let galaxy = null;

    const generateGalaxy = () => {
        // Destroy old galaxy
        if(galaxy !== null) {
            galaxyGeometry.dispose();
            galaxyMaterial.dispose();
            galaxyHolder.remove(galaxy)
        }

        galaxyGeometry = new THREE.BufferGeometry();
        galaxyMaterial = new THREE.PointsMaterial({
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        const position = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        
        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        
        for(let i = 0; i < parameters.count * 3 ; i++) {
            const i3 = i * 3;

            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;
            const branchAngle = ((i % parameters.branches) / parameters.branches) * (Math.PI * 2);
            
            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

            position[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            position[i3 + 1] = randomY;
            position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / parameters.radius)

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
            
        }
        
        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
        galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        galaxy =  new THREE.Points(galaxyGeometry, galaxyMaterial);

        galaxyHolder.add(galaxy);
    }
    
    scene.add(galaxyHolder);
    generateGalaxy();

    gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy);
    gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
    gui.add(parameters, 'radius').min(1).max(10).step(0.1).onFinishChange(generateGalaxy);
    gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
    gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
    gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
    gui.add(parameters, 'randomnessPower').min(0).max(10).step(1).onFinishChange(generateGalaxy);
    gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
    gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

    
    
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
    camera.position.y = 3
    camera.position.z = 3
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

        galaxyHolder.rotation.y += 0.001;
        
        // Update controls
        controls.update()
        
        // Render
        renderer.render(scene, camera)
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    
    tick()