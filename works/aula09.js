import * as THREE from  '../libs/other/three.module.r82.js';
import {RaytracingRenderer} from  '../libs/other/raytracingRenderer.js';
import {degreesToRadians} from "../libs/util/util.js";

var scene, renderer;

var container = document.createElement( 'div' );
document.body.appendChild( container );

var scene = new THREE.Scene();

// The canvas is in the XY plane.
// Hint: put the camera in the positive side of the Z axis and the
// objects in the negative side
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = 3;
camera.position.y = 2.25;

// light
var intensity = 0.5;
var light = new THREE.PointLight( 0xffffff, intensity );
light.position.set( 0, 2.50, 0 );
scene.add( light );

var light = new THREE.PointLight( 0x55aaff, intensity );
light.position.set( -1.00, 1.50, 2.00 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, intensity );
light.position.set( 1.00, 1.50, 2.00 );
scene.add( light );

renderer = new RaytracingRenderer(window.innerWidth, window.innerHeight, 32, camera);
container.appendChild( renderer.domElement );

// materials

var phongMaterialBoxBottom = new THREE.MeshLambertMaterial( {
	color: "rgb(180,180,180)",
} );

var phongMaterialBox = new THREE.MeshLambertMaterial( {
	color: "rgb(220,220,220)",
} );


var phongMaterialWall = new THREE.MeshLambertMaterial( {
	color: "rgb(100,100,220)",
} );


var mirrorMaterial = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(255,255,255)",
	shininess: 1000,
} );
mirrorMaterial.mirror = true;
mirrorMaterial.reflectivity = 1;

var mirrorMaterialSmoothYellow = new THREE.MeshPhongMaterial( {
	color: "rgb(255,170,0)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );
mirrorMaterialSmoothYellow.mirror = true;
mirrorMaterialSmoothYellow.reflectivity = 0.1;

var mirrorMaterialSmoothRed = new THREE.MeshPhongMaterial( {
	color: "rgb(255,20,0)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );
mirrorMaterialSmoothRed.mirror = true;
mirrorMaterialSmoothRed.reflectivity = 0.1;

var mirrorMaterialSmoothBlue = new THREE.MeshPhongMaterial( {
	color: "rgb(50,20,255)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );
mirrorMaterialSmoothBlue.mirror = true;
mirrorMaterialSmoothBlue.reflectivity = 0.1;


// geometries
var sphereGeometry = new THREE.SphereGeometry( 1, 24, 24 );
var planeGeometry = new THREE.BoxGeometry( 6.00, 0.05, 3.00 );
var planeGeometry2 = new THREE.BoxGeometry( 3.00, 0.05, 3.00 );
var cylinderGeometry = new THREE.CylinderGeometry (0.5,0.5, 1.0, 80);
var knotGeometry = new THREE.TorusKnotGeometry (1, 0.3, 64, 64);
var specialCylinderGeometry = new THREE.CylinderGeometry (0.45,0.15, 0.8, 80);

// Glass Sphere (black-right-front)
var glass = new THREE.Mesh( sphereGeometry, mirrorMaterial );
glass.scale.multiplyScalar( 0.5 );
glass.position.set( 0, 2.49, -3.00 );
glass.rotation.y = 0.6;
scene.add( glass );

//supporters
var cylinder = new THREE.Mesh ( cylinderGeometry, mirrorMaterialSmoothBlue);
cylinder.position.set (0, 1.50, -3.00);
scene.add (cylinder);

var cylinder2 = new THREE.Mesh ( cylinderGeometry, mirrorMaterialSmoothBlue);
cylinder2.position.set (2.00, 1.50, -2.25);
scene.add (cylinder2);

var cylinder3 = new THREE.Mesh ( cylinderGeometry, mirrorMaterialSmoothBlue);
cylinder3.position.set (-2.00, 1.50, -2.25);
scene.add (cylinder3);

//spceial cylinder
var specialCylinder = new THREE.Mesh (specialCylinderGeometry, mirrorMaterialSmoothRed);
specialCylinder.position.set (2.00, 2.3, -2.25);
scene.add (specialCylinder);

//knot
var knot = new THREE.Mesh (knotGeometry, mirrorMaterialSmoothYellow);
knot.scale.multiplyScalar( 0.25 );
knot.position.set(-2.00, 2.45, -2.05);
scene.add(knot);

// bottom
var plane = new THREE.Mesh( planeGeometry, phongMaterialBoxBottom );
plane.position.set( 0, 1.00, -3.00 );
scene.add( plane );

// top
var plane = new THREE.Mesh( planeGeometry, phongMaterialBox );
plane.position.set( 0, 4.0, -3.00 );
scene.add( plane );

// back
var plane = new THREE.Mesh( planeGeometry, phongMaterialBox );
plane.rotation.x = 1.57;
plane.position.set( 0, 2.50, -4.50 );
scene.add( plane );

// left
var plane = new THREE.Mesh( planeGeometry2, phongMaterialWall );
plane.rotation.x = degreesToRadians(90);
plane.rotation.z = 1.57;
plane.position.set( -3.00, 2.50, -3.00 )
scene.add( plane );

// right
var plane = new THREE.Mesh( planeGeometry2, phongMaterialWall );
plane.rotation.x = degreesToRadians(90);
plane.rotation.z = 1.57;
plane.position.set( 3.00, 2.50, -3.00 )
scene.add( plane );

render();

function render()
{
	renderer.render( scene, camera );
}
