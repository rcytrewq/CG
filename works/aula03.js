import * as THREE from  '../build/three.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initDefaultLighting,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
scene.background = new THREE.Color('rgb(20,20,20)');
var renderer = initRenderer();    // View function in util/utils

//var light = initDefaultLighting(scene, new THREE.Vector3(5.0, 5.0, 5.0)); // Use default light    

// Show world axes
var axesHelper = new THREE.AxesHelper( 120 );
scene.add( axesHelper );

// Main camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0.2);
  camera.position.set(200,200,-500)
  camera.up.set( 0,1, 0, );

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//yellow
const geometry = new THREE.PlaneGeometry( 100, 100,100,100);
geometry.translate(0.0, 0.0, 0.0);
geometry.rotateX(1.5708); // To avoid conflict with the 
const material = new THREE.MeshBasicMaterial( {color: 0xffff00,  wireframe:true} );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

//red
const geometry2 = new THREE.PlaneGeometry( 100, 100,100,100);
geometry2.translate(0.0, 50.0, 50.0);
//geometry.rotateX(1.5708); // To avoid conflict with the 
const material2 = new THREE.MeshBasicMaterial( {color: 'rgb(255,0,0)',  wireframe:true} );
const plane2 = new THREE.Mesh( geometry2, material2 );
scene.add( plane2 );

//blue
const geometry3 = new THREE.PlaneGeometry( 100, 100,100,100);
geometry3.translate(0.0, 50.0, 50.0);
geometry3.rotateY(1.5708); // To avoid conflict with the 
const material3 = new THREE.MeshBasicMaterial( {color: 'rgb(0,0,255)',  wireframe:true} );
const plane3 = new THREE.Mesh( geometry3, material3 );
scene.add( plane3 );

//green
const geometry4 = new THREE.PlaneGeometry( 100, 100,100,100);
geometry4.translate(0.0, 50.0, -50.0);
geometry4.rotateY(1.5708); // To avoid conflict with the 
const material4 = new THREE.MeshBasicMaterial( {color: 'rgb(0,255,0)',  wireframe:true} );
const plane4 = new THREE.Mesh( geometry4, material4 );
scene.add( plane4 );

//white
const geometry5 = new THREE.PlaneGeometry( 100, 100,100,100);
geometry5.translate(0.0, 0.0, -100.0);
geometry5.rotateX(1.5708); // To avoid conflict with the 
const material5 = new THREE.MeshBasicMaterial( {color: 'rgb(255,255,255)',  wireframe:true} );
const plane5 = new THREE.Mesh( geometry5, material5 );
scene.add( plane5 );

// Create objects
//createTeapot( 2.0,  0.5,  0.0, Math.random() * 0xffffff);
//createTeapot(0.0,  0.5,  2.0, Math.random() * 0xffffff);  
//createTeapot(0.0,  0.5, -2.0, Math.random() * 0xffffff);    

//-------------------------------------------------------------------------------
// Setting virtual camera
//-------------------------------------------------------------------------------
var lookAtVec = new THREE.Vector3( 0.0, 50.0, 0.0 );
var upVec = new THREE.Vector3( 0.0, 0.0, 1.0 );
var vcWidth = 400; // virtual camera width
var vcHeidth = 300; // virtual camera height
var virtualCamera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 1.0, 250.0);
  virtualCamera.lookAt(lookAtVec);
  virtualCamera.position.set(0,50,-250);
  virtualCamera.up = upVec;

// Create helper for the virtual camera
const cameraHelper = new THREE.CameraHelper(virtualCamera);
scene.add(cameraHelper);

// Create 3D representation of the camera (cube and cone)
var cameraObj = createCameraObject();

scene.add(new THREE.HemisphereLight);

updateCamera();
render();

function createCameraObject()
{
  var matBody = new THREE.MeshPhongMaterial({color:"rgb(255, 0, 0)"});    
  var matLens = new THREE.MeshPhongMaterial({color:"rgb(255, 255, 0)"});        

  var cBody = new THREE.BoxGeometry(.2, .2, .2);
  var body = new THREE.Mesh(cBody, matBody);

  var cLens = new THREE.ConeGeometry(0.1, 0.2, 20);
  var lens = new THREE.Mesh(cLens, matLens);
    lens.rotateX(degreesToRadians(90));
    lens.position.set(0.0, 0.0, -0.1);
  body.add(lens); // Add lens to the body of the camera

  scene.add(body); // Add camera object to scene
  return body;
}

function createTeapot(x, y, z, color )
{
  var geometry = new TeapotGeometry(0.5);
  var material = new THREE.MeshPhongMaterial({color, shininess:"200"});
    material.side = THREE.DoubleSide;
  var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
    obj.position.set(x, y, z);
  scene.add(obj);
}

function updateCamera()
{
  //-- Update virtual camera position --
  virtualCamera.lookAt(lookAtVec);        // Update camera position
  virtualCamera.updateProjectionMatrix(); // Necessary when updating FOV angle         
  cameraHelper.update();    

  //-- Update camera 3D representation --
  var cwd = new THREE.Vector3();    
  virtualCamera.getWorldPosition(cwd);
  cameraObj.position.set(cwd.x, cwd.y, cwd.z);
  cameraObj.setRotationFromQuaternion(virtualCamera.quaternion); // Get camera rotation
}



function keyboardUpdate() {

    keyboard.update();
  
    var angle = degreesToRadians(0.5);
    var rotAxis1 = new THREE.Vector3(1,0,0); // Set X axis
    var rotAxis2 = new THREE.Vector3(0,1,0); // Set Y axis
    var rotAxis3 = new THREE.Vector3(0,0,3); // Set Z axis
  
    
    if ( keyboard.pressed("space") ) virtualCamera.translateZ( -1 );
  
    if ( keyboard.pressed("down") )  virtualCamera.rotateOnAxis(rotAxis1,  angle );
    if ( keyboard.pressed("up") )  virtualCamera.rotateOnAxis(rotAxis1, -angle );

    if ( keyboard.pressed("left") )  virtualCamera.rotateOnAxis(rotAxis2,  angle );
    if ( keyboard.pressed("right") )  virtualCamera.rotateOnAxis(rotAxis2, -angle );

    if ( keyboard.pressed(",") )  virtualCamera.rotateOnAxis(rotAxis3,  angle );
    if ( keyboard.pressed(".") )  virtualCamera.rotateOnAxis(rotAxis3, -angle );
  
    
  }


function controlledRender()
{
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, virtualCamera);   

  // Set virtual camera viewport 
  var offset = 20; 
  renderer.setViewport(5, 600, 400, 300);  // Set virtual camera viewport  
  renderer.setScissor(5, 600, 400, 300); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.setClearColor("rgb(60, 50, 150)");  // Use a darker clear color in the small viewport 
  renderer.clear(); // Clean the small viewport
  renderer.render(scene,camera);  // Render scene of the virtual camera
}

function render()
{

  trackballControls.update();
  controlledRender();
  keyboardUpdate();
  requestAnimationFrame(render);
}