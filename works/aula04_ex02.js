import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        initDefaultLighting, 
        degreesToRadians, 
        lightFollowingCamera,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils

var camera = initCamera(new THREE.Vector3(30, 30, 30)); // Init camera in this position
camera.up.set(0, 0, 1);
camera.lookAt(0.0, 0.0, 0.0);
var light  = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Set angles of rotation

var speed = 0.05;
var animationOn = false; // control if animation is on or of


var posx=11;
var posy=0;
var posy = 11;


// Show world axes
var axesHelper = new THREE.AxesHelper( 15 );
scene.add( axesHelper );

//plan
const geometry = new THREE.PlaneGeometry( 25, 25,100,100);
geometry.translate(0.0, 0.0, -0.05);

const material = new THREE.MeshBasicMaterial({color: 'rgb(0,0,255)', wireframe:true});
const plane = new THREE.Mesh( geometry, material );
scene.add(plane);

// Base sphere
var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
sphereGeometry.translate(0,0,0.0);
var sphereMaterial = new THREE.MeshBasicMaterial( {color:'rgb(255,0,0)', wireframe:true} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add(sphere);
// Set initial position of the sphere
sphere.translateX(1.0).translateY(1.0).translateZ(1.0);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();

function animate()
{
  if(animationOn)
  {
    sphere.lookAt(new THREE.Vector3(posx, posy,1));
    if (Math.abs(sphere.position.x - posx)>speed || Math.abs(sphere.position.y - posy)>speed){
      sphere.translateZ(speed);
    }
    else{
      animationOn = !animationOn;
    }
  }
}

function buildInterface()
{
  var controls = new function ()
  {
    this.onChangeAnimation = function(){
      animationOn = !animationOn;
    };

    this.speed = 0.05;
    this.posx=0;
    this.posy = 0;

    this.changeSpeed = function(){
      speed = this.speed;
    };

    this.changeX = function(){
      posx = this.posx;
    };

    this.changeZ = function(){
      posy = this.posy;
    };

    this.reset = function(){
      sphere.position.set(0,0,1);
      controls.posx = 0;
      controls.posy= 0;
    }
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
  
  gui.add(controls, 'speed', 0.05, 0.5)
    .onChange(function(e) { controls.changeSpeed() })
    .name("Change Speed");

  gui.add(controls, 'posx', -12.5, 12.5)
    .onChange(function(e) { controls.changeX() })
    .name("X position");

  gui.add(controls, 'posy', -12.5, 12.5)
    .onChange(function(e) { controls.changeZ() })
    .name("Y position");

  gui.add(controls, 'reset')
    .onChange(function(e) { controls.reset() })
    .name("Reset");
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  animate();
  lightFollowingCamera(light, camera);
  requestAnimationFrame(render);

  renderer.render(scene, camera) // Render scene
}
