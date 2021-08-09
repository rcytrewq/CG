import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initDefaultLighting,
        createGroundPlane,
        onWindowResize, 
        getMaxSize,
        degreesToRadians} from "../libs/util/util.js";




var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

//utilities
var spGroup; 
var animationOn = true;
var speed = 0.05;
var angle = 0;

//scene
var light = initDefaultLighting(scene, new THREE.Vector3(30, 0, 20)); // Use default light
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(45,45,20);
  camera.up.set( 0, 0, 1 );


// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );


// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 120 );
  axesHelper.visible = true;
scene.add( axesHelper );

// create cylinder
var faceSize = 5;
var cylinderGeometry = new THREE.CylinderGeometry(faceSize, faceSize, 3*faceSize,32, 1, true);
var cylinderMaterial = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
var cylinder = new THREE.Mesh(cylinderGeometry.rotateX(degreesToRadians(90)), cylinderMaterial);
// position the second cube
cylinder.position.set(0, 0, faceSize*3/2.);
// add the second cube to the scene
scene.add(cylinder);
// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var wood = textureLoader.load('../assets/textures/wood.png');

// Add texture to the 'map' property of the object's material
cylinder.material.map = wood;


//create circles

var circleGeometry = new THREE.CircleGeometry(faceSize, 32);
var circleMaterial = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});

var circle1 = new THREE.Mesh(circleGeometry, circleMaterial);
var woodtop = textureLoader.load('../assets/textures/woodtop.png');
circle1.material.map = woodtop;
circle1.position.set(0,0,-faceSize*3/2.);
cylinder.add(circle1);

var circle2 = new THREE.Mesh(circleGeometry, circleMaterial);
var woodtop = textureLoader.load('../assets/textures/woodtop.png');
circle2.material.map = woodtop;
circle2.position.set(0,0,faceSize*3/2.);
cylinder.add(circle2);



render();

function render()
{
  stats.update();
  trackballControls.update();
  
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
