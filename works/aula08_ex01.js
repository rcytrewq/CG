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
scene.background = new THREE.Color('rgb(0,0,0');
//utilities
var spGroup; 
var animationOn = true;
var speed = 0.05;
var angle = 0;

//scene
var light = initDefaultLighting(scene, new THREE.Vector3(25, 30, 20)); // Use default light
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(45,45,20);
  camera.up.set( 0, 0, 1 );


// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
  axesHelper.visible = true;
scene.add( axesHelper );


var faceSize = 5;

function createFace(x,y,z){
  
  var faceGeometry = new THREE.PlaneGeometry(faceSize, faceSize);
  var faceMaterial = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
  var face = new THREE.Mesh(faceGeometry, faceMaterial);
  face.position.set(x,y,z)
  

  // Use TextureLoader to load texture files
  var textureLoader = new THREE.TextureLoader();
  var stone = textureLoader.load('../assets/textures/marble128.png');

  // Add texture to the 'map' property of the object's material
  face.material.map = stone;
  return face;
}




var cube = createFace(0,0,0);
cube.add(createFace(0,faceSize/2., faceSize/2.).rotateX(degreesToRadians(90)));
cube.add(createFace(0,-faceSize/2., faceSize/2.).rotateX(degreesToRadians(90)));
cube.add(createFace(faceSize/2.,0, faceSize/2.).rotateY(degreesToRadians(90)).rotateZ(degreesToRadians(90)));
cube.add(createFace(-faceSize/2.,0, faceSize/2.).rotateY(degreesToRadians(90)).rotateZ(degreesToRadians(90)));
scene.add(cube);





render();


function render()
{
  stats.update();
  trackballControls.update();
  
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
