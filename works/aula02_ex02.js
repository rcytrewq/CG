import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        initDefaultLighting,
        onWindowResize, 
        degreesToRadians, 
        lightFollowingCamera} from "../libs/util/util.js";

        
var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(7, 7, 7)); // Init camera in this position
var light  = initDefaultLighting(scene, new THREE.Vector3(7, 7, 7));
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Set angles of rotation
var angle1 = [0,0, -90]; // In degreesToRadians
var angle2 = [0,0, 0]; // In degreesToRadians
var angle3 = [0,0, 0]; // In degreesToRadians

// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var s1 = createSphere();
scene.add(s1);

var c1 = createCylinder();
s1.add(c1);

var s2 = createSphere();
c1.add(s2);

var c2 = createCylinder();
s2.add(c2);

var s3 = createSphere();
c2.add(s3);

var c3 = createCylinder();
s3.add(c3);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();

function createSphere()
{
  var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)'} )
  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  return sphere;
}

function createCylinder()
{
  var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
  var cylinderMaterial = new THREE.MeshNormalMaterial( );
  var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  return cylinder;
}

function rotateCylinder()
{
  // More info:
  // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
  c1.matrixAutoUpdate = false;
  s2.matrixAutoUpdate = false;
  c2.matrixAutoUpdate = false;
  s3.matrixAutoUpdate = false;
  c3.matrixAutoUpdate = false;

  var mat4 = new THREE.Matrix4();

  // resetting matrices
  c1.matrix.identity();
  s2.matrix.identity();
  c2.matrix.identity();
  s3.matrix.identity();
  c3.matrix.identity();


  // Will execute T1 and then R1
  c1.matrix.multiply(mat4.makeRotationX(angle1[0])); // R1x
  c1.matrix.multiply(mat4.makeRotationY(angle1[1])); // R1y
  c1.matrix.multiply(mat4.makeRotationZ(angle1[2])); // R1z
  
  c1.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1
  
  // Just need to translate the sphere to the right position
  s2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

  // Will execute T2 and then R2
  c2.matrix.multiply(mat4.makeRotationX(angle2[0])); // R2x
  c2.matrix.multiply(mat4.makeRotationY(angle2[1])); // R2y
  c2.matrix.multiply(mat4.makeRotationZ(angle2[2])); // R2z

  c2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T2

  // Just need to translate the sphere to the right position
  s3.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

  // Will execute T2 and then R2
  c3.matrix.multiply(mat4.makeRotationX(angle3[0])); // R3x
  c3.matrix.multiply(mat4.makeRotationY(angle3[1])); // R3y
  c3.matrix.multiply(mat4.makeRotationZ(angle3[2])); // R3z

  c3.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T3
}

function buildInterface()
{
  var controls = new function ()
  {
    this.joint1x = 0;
    this.joint1y = 0;
    this.joint1z = -90;

    this.joint2x = 0;
    this.joint2y = 0;
    this.joint2z = 0;

    this.joint3x = 0;
    this.joint3y = 0;
    this.joint3z = 0;
    

    this.rotate = function(){
      angle1[0] = degreesToRadians(this.joint1x);
      angle1[1] = degreesToRadians(this.joint1y);
      angle1[2] = degreesToRadians(this.joint1z);

      angle2[0] = degreesToRadians(this.joint2x);
      angle2[1] = degreesToRadians(this.joint2y);
      angle2[2] = degreesToRadians(this.joint2z);

      angle3[0] = degreesToRadians(this.joint3x);
      angle3[1] = degreesToRadians(this.joint3y);
      angle3[2] = degreesToRadians(this.joint3z);
      rotateCylinder();
    };
  };

  // GUI interface
  var gui = new GUI();
  const firstFolder = gui.addFolder("First Sphere");
  const scndFolder = gui.addFolder("Second Sphere");
  const trdFolder = gui.addFolder("Third Sphere");

  firstFolder.add(controls, 'joint1x', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("X axis");
  firstFolder.add(controls, 'joint1y', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("Y axis");
  firstFolder.add(controls, 'joint1z', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("Z axis");

  scndFolder.add(controls, 'joint2x', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("X axis");
  scndFolder.add(controls, 'joint2y', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("Y axis");
  scndFolder.add(controls, 'joint2z', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("Z axis");

  trdFolder.add(controls, 'joint3x', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("X axis");
  trdFolder.add(controls, 'joint3y', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("Y axis");
  trdFolder.add(controls, 'joint3z', -180, 180)
    .onChange(function(e) { controls.rotate() })
    .name("Z axis");
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  rotateCylinder();
  lightFollowingCamera(light, camera);
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
