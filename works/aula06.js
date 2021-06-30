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
var light = initDefaultLighting(scene, new THREE.Vector3(25, 30, 20)); // Use default light
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(45,45,20);
  camera.up.set( 0, 0, 1 );


// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(100, 100); // width and height
  //groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
  axesHelper.visible = true;
scene.add( axesHelper );

// Object Material

var engineMaterial = new THREE.MeshPhongMaterial({color: "rgb(255,255,255)"});
var bladeMaterial = new THREE.MeshPhongMaterial({color: "rgb(0,0,255)"});
var baseMaterial = new THREE.MeshPhongMaterial({color: "rgb(192,192,192)"});
var towerMaterial = new THREE.MeshPhongMaterial({color: "rgb(60,60,60)"});
  
// crete propeller base
const torusgeometry = new THREE.TorusGeometry( 0.55, 0.2, 16, 100 );
torusgeometry.rotateX(degreesToRadians(90));
const torusmaterial = new THREE.MeshPhongMaterial( { color: "rgb(0,0,0)" } );
const torus = new THREE.Mesh( torusgeometry, torusmaterial );
scene.add( torus );
torus.position.set(0.0, 3.25, 15.0);

// Create Lathe Geometry - engine
var points = generatePoints();
var segments = 20;
var phiStart = 0;
var phiLength = 2 * Math.PI;
var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
var engine = new THREE.Mesh(latheGeometry, engineMaterial);
  engine.castShadow = true;
scene.add(engine);
var scale = getMaxSize(engine);
engine.scale.set(2.5 * (1.0/scale),
                7 * (1.0/scale),
                2.55 * (1.0/scale));
engine.position.set(0,-2,15);


// Create Lathe Geometry - blades
var points2 = propeller();
var segments2 = 30;
var phiStart2 = 0;
var phiLength2 = 2 * Math.PI;
var latheGeometry2 = new THREE.LatheGeometry(points2, segments2, phiStart2, phiLength2);
var blade1 = new THREE.Mesh(latheGeometry2, bladeMaterial);
  blade1.castShadow = true;
blade1.rotateX(degreesToRadians(90));
torus.add(blade1);
var scale = getMaxSize(blade1);
blade1.scale.set(1 * (1.0/scale),
                10 * (1.0/scale),
                1 * (1.0/scale));
blade1.position.set(0,0,4);

var blade2 = new THREE.Mesh(latheGeometry2, bladeMaterial);
  blade2.castShadow = true;
  blade2.rotateX(degreesToRadians(90));
torus.add(blade2);
var scale = getMaxSize(blade2);
blade2.scale.set(1 * (1.0/scale),
                10 * (1.0/scale),
                1 * (1.0/scale));
blade2.rotateZ(degreesToRadians(120));
blade2.position.set(-3.5,0,-2);

var blade3 = new THREE.Mesh(latheGeometry2, bladeMaterial);
  blade3.castShadow = true;
  blade3.rotateX(degreesToRadians(90));
torus.add(blade3);
var scale = getMaxSize(blade3);
blade3.scale.set(1 * (1.0/scale),
                10 * (1.0/scale),
                1 * (1.0/scale));
blade3.rotateZ(degreesToRadians(240));
blade3.position.set(3.5,0,-2);


// Create Extrude Geometry

var extrudeSettings = //squared base
{
  depth:0.5,
  bevelEnabled: false 
};

var extrudeSettings2 = // rounded base
{
  depth:2,
  bevelEnabled: false 
};

var extrudeSettings3 = // propeller
{
  steps: 5,
	depth: 0.1,
	bevelEnabled: true,
	bevelThickness: 0.2,
	bevelSize: 0.5,
	bevelOffset: 1,
	bevelSegments: 5
};

var extrudeGeometry = new THREE.ExtrudeGeometry(groundBase(), extrudeSettings);
var suqaredBase = new THREE.Mesh(extrudeGeometry, baseMaterial);
  suqaredBase.castShadow = true;
scene.add(suqaredBase);
suqaredBase.position.set(2.5,2.5,0);
suqaredBase.rotateZ(degreesToRadians(180));

var extrudeGeometry2 = new THREE.ExtrudeGeometry(base(), extrudeSettings2);
var roundedBase = new THREE.Mesh(extrudeGeometry2, baseMaterial);
  suqaredBase.castShadow = true;
scene.add(roundedBase);
suqaredBase.position.set(2.5,2.5,0);

roundedBase.rotateZ(degreesToRadians(180));
roundedBase.rotateZ(degreesToRadians(180));

var towerGeometry = new THREE.CylinderGeometry(0.5,0.8,15,35);
var tower = new THREE.Mesh(towerGeometry, towerMaterial);
  tower.castShadow = true;
scene.add(tower);
tower.rotateX(degreesToRadians(90));
tower.position.set(0,0,7.5);


buildInterface();
render();

function generatePoints()
{
  var points = [];
  var numberOfPoints = 12;
  points.push(new THREE.Vector2(0,0));
  for (var i = 0; i < numberOfPoints; i++) {
    points.push(new THREE.Vector2(Math.sin(i*2 / 4.17)+3, i/1.5));
  }
  points.push(new THREE.Vector2(0,12/1.5));
  
  
  return points;
}

function base() {
  var center = new THREE.Shape();
  center. absellipse( 0.0, 0.0, 1.0, 1.0, 0, Math.PI*2, true );

  var hole = new THREE.Shape();
  hole. absellipse( 0.0, 0.0, 0.9, 0.9, 0, Math.PI*2, true );

  center.holes.push( hole );
  return center;
}

function propeller() {var points = [];
  var numberOfPoints = 12;
  points.push(new THREE.Vector2(0,0));
  for (var i = 0; i < numberOfPoints; i++) {
    points.push(new THREE.Vector2(Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ));
  }
  points.push(new THREE.Vector2(0,7*2));
  
  return points;
}

function groundBase()
{
  var squaredBase = new THREE.Shape();
    
    squaredBase.absellipse( 2.5, 0.0, 1.0, 1.0, Math.PI, Math.PI*2, true );
    squaredBase.lineTo(5,0);
    squaredBase.lineTo(5,1.5);
    squaredBase.absellipse( 5, 2.5, 1.0, 1.0, -Math.PI/2, Math.PI/2, true );
    squaredBase.lineTo(5,5);
    squaredBase.lineTo(3.5,5);
    squaredBase.absellipse( 2.5, 5.0, 1.0, 1.0, Math.PI*2, Math.PI, true );
    squaredBase.lineTo(0,5);
    squaredBase.lineTo(0,3.5);
    squaredBase.absellipse( 0, 2.5, 1.0, 1.0, Math.PI/2, -Math.PI/2, true );
    squaredBase.lineTo(0,0);
    squaredBase.lineTo(1.5,0);

    
  var baseHole1Path = new THREE.Path();
    baseHole1Path.absellipse( 0.5, 0.5, 0.25, 0.25, 0, Math.PI*2, false );

   var baseHole2Path = new THREE.Path();
     baseHole2Path.absellipse( 0.5, 4.5, 0.25, 0.25, 0, Math.PI*2, true );

    var baseHole3Path = new THREE.Path();
    baseHole3Path.absellipse( 4.5, 0.5, 0.25, 0.25, 0, Math.PI*2, true );

  var baseHole4Path = new THREE.Path();
    baseHole4Path.absellipse( 4.5, 4.5, 0.25, 0.25, 0, Math.PI*2, true );

    var baseHole5Path = new THREE.Path();
    baseHole5Path.absellipse( 2.5, 2.5, 1, 1, 0, Math.PI*2, true );

  squaredBase.holes.push( baseHole1Path );
  squaredBase.holes.push( baseHole2Path );
  squaredBase.holes.push( baseHole3Path );
  squaredBase.holes.push( baseHole4Path );
  squaredBase.holes.push( baseHole5Path );
  
  return squaredBase;
}


function rotateTorus()
{
  
  torus.matrixAutoUpdate = false;
  torus.matrix.identity();
  var mat4 = new THREE.Matrix4();
  torus.matrix.multiply(mat4.makeTranslation(0.0, 3.25, 15.0)); // T1

  // Set angle's animation speed
  if(animationOn)
  {
    angle+=speed;
    var mat4 = new THREE.Matrix4();
    torus.matrix.multiply(mat4.makeRotationY(-angle)); // R1
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

    this.changeSpeed = function(){
      speed = this.speed;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
  gui.add(controls, 'speed', 0.0, 1.)
    .onChange(function(e) { controls.changeSpeed() })
    .name("Change Speed");
}

function render()
{
  stats.update();
  trackballControls.update();
  rotateTorus();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
