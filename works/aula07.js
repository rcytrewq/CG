import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {
    initRenderer,
    createGroundPlane,
    onWindowResize,
    degreesToRadians,
    InfoBox
} from "../libs/util/util.js";

var scene = new THREE.Scene();
var stats = new Stats();
var renderer = initRenderer();
renderer.setClearColor("rgb(30, 30, 42)");

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
  axesHelper.visible = true;
scene.add( axesHelper );


var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(0, 3, 8);
camera.up.set(0, 1, 0);
var trackballControls = new TrackballControls(camera, renderer.domElement);
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

var groundPlane = createGroundPlane(7, 7, 50, 50, 'rgb(50,50,50)'); // width and height
groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({ color: "rgb(255,255,255)", shininess: "200" });
material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
obj.castShadow = true;
obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);

var rotate = false;


var barGeometry = new THREE.CylinderGeometry(0.02, 0.02, 5, 4, 4)
var barGeometry2 = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 20, 20)
var barMaterial = new THREE.LineBasicMaterial({ color: "rgb(255,255,255)" });
var horizontalSupport1 = new THREE.Mesh(barGeometry, barMaterial);
horizontalSupport1.rotateX(degreesToRadians(90));
horizontalSupport1.translateX(2.5);
horizontalSupport1.translateZ(-2.5);
scene.add(horizontalSupport1);

var horizontalSupport2 = new THREE.Mesh(barGeometry, barMaterial);
horizontalSupport2.rotateX(degreesToRadians(90));
horizontalSupport2.translateX(-2.5);
horizontalSupport2.translateZ(-2.5);
scene.add(horizontalSupport2);

var horizontalSupport3 = new THREE.Mesh(barGeometry, barMaterial);
horizontalSupport3.rotateX(degreesToRadians(90));
horizontalSupport3.rotateZ(degreesToRadians(90))
horizontalSupport3.translateX(2.5);
horizontalSupport3.translateZ(-2.5);
scene.add(horizontalSupport3);

var verticalSupport1 = new THREE.Mesh(barGeometry2, barMaterial);
//verticalSupport1.rotateX(degreesToRadians(90));
verticalSupport1.rotateY(degreesToRadians(90))
verticalSupport1.translateX(2.5);
verticalSupport1.translateZ(-2.5);
verticalSupport1.translateY(1.25);
scene.add(verticalSupport1);

var verticalSupport2 = new THREE.Mesh(barGeometry2, barMaterial);
verticalSupport2.rotateY(degreesToRadians(90))
verticalSupport2.translateX(2.5);
verticalSupport2.translateZ(2.5);
verticalSupport2.translateY(1.25);
scene.add(verticalSupport2);

var verticalSupport3 = new THREE.Mesh(barGeometry2, barMaterial);
verticalSupport3.rotateY(degreesToRadians(90))
verticalSupport3.translateX(-2.5);
verticalSupport3.translateZ(2.5);
verticalSupport3.translateY(1.25);
scene.add(verticalSupport3);

var verticalSupport4 = new THREE.Mesh(barGeometry2, barMaterial);
verticalSupport4.rotateY(degreesToRadians(90))
verticalSupport4.translateX(-2.5);
verticalSupport4.translateZ(-2.5);
verticalSupport4.translateY(1.25);
scene.add(verticalSupport4);



var color = "rgb(255,0,0)";
var lightSphere1 = createLightSphere(0.15, 32, 32, horizontalSupport1.position, color);
var spotLight1 = new THREE.SpotLight(color);
setSpotLight( horizontalSupport1.position, spotLight1);
scene.add(spotLight1);

color = "rgb(0,0,255)";
var lightSphere2 = createLightSphere(0.15, 32, 32, horizontalSupport2.position, color);
var spotLight2 = new THREE.SpotLight(color);
setSpotLight( horizontalSupport2.position, spotLight2);
scene.add(spotLight2);

color = "rgb(0,255,0)";
var lightSphere3 = createLightSphere(0.15, 32, 32, horizontalSupport3.position, color);
var spotLight3 = new THREE.SpotLight(color);
setSpotLight( horizontalSupport3.position, spotLight3);
scene.add(spotLight3);

var ambientLight = new THREE.AmbientLight("rgb(255,147,41)");
scene.add(ambientLight);

var keyboard = new KeyboardState();

var controls = new InfoBox();
controls.add("KEYBOARD CONTROLS");
controls.addParagraph();
controls.add("↑↓ : control red light");
controls.addParagraph();

controls.add("←→ : control green light");
controls.addParagraph();

controls.add("<> : control blue light");
controls.show();

buildInterface();
render();

function keyboardUpdate() {
    keyboard.update();
    if (keyboard.pressed("up")) {
        lightSphere1.position.z -= 0.015;
        spotLight1.position.z -= 0.015
        if (lightSphere1.position.z < -2.5) {
            lightSphere1.position.z = -2.5;
            spotLight1.position.z = -2.5;
        }
    }
    if (keyboard.pressed("down")) {
        lightSphere1.position.z += 0.015;
        spotLight1.position.z += 0.015;
        if (lightSphere1.position.z > 2.5) {
            lightSphere1.position.z = 2.5;
            spotLight1.position.z = 2.5;
        }
    }

    if (keyboard.pressed(".")) {
        lightSphere2.position.z -= 0.015;
        spotLight2.position.z -= 0.015
        if (lightSphere2.position.z < -2.5) {
            lightSphere2.position.z = -2.5;
            spotLight2.position.z = -2.5;
        }
    }
    if (keyboard.pressed(",")) {
        lightSphere2.position.z += 0.015;
        spotLight2.position.z += 0.015;
        if (lightSphere2.position.z > 2.5) {
            lightSphere2.position.z = 2.5;
            spotLight2.position.z = 2.5;
        }
    }

    if (keyboard.pressed("left")) {
        lightSphere3.position.x -= 0.015;
        spotLight3.position.x -= 0.015
        if (lightSphere3.position.x < -2.5) {
            lightSphere3.position.x = -2.5;
            spotLight3.position.x = -2.5;
        }
    }
    if (keyboard.pressed("right")) {
        lightSphere3.position.x += 0.015;
        spotLight3.position.x += 0.015;
        if (lightSphere3.position.x > 2.5) {
            lightSphere3.position.x = 2.5;
            spotLight3.position.x = 2.5;
        }
    }
}

function createLightSphere(radius, widthSegments, heightSegments, position, color) {
    var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var object = new THREE.Mesh(geometry, material);
    object.visible = true;
    object.position.copy(position);
    scene.add(object);
    return object;
}

function setSpotLight(position, sl) {
    sl.position.copy(position);
    sl.shadow.mapSize.width = 512;
    sl.shadow.mapSize.height = 512;
    sl.angle = degreesToRadians(45);
    sl.castShadow = true;
    sl.decay = 2;
    sl.penumbra = 0.5;
}

function buildInterface() {
    //------------------------------------------------------------
    // Interface
    var controls = new function () {
        this.ambientLight = true;
        this.rotationTeaPot = false;
        this.on1 = true;
        this.on2 = true;
        this.on3 = true;

        this.onEnableAmbientLight = function () {
            ambientLight.visible = this.ambientLight;
        };

        this.onChangeRotationBule = function () {
            rotate = !rotate;
        }

        this.onChangeOn1 = function () {
            spotLight1.visible = this.on1;
            if (!this.on1) {
                lightSphere1.material.color.set("rgb(90,0,0)");
            } else {
                lightSphere1.material.color.set("rgb(255,0,0)");
            }

        }
        this.onChangeOn2 = function () {
            spotLight2.visible = this.on2;
            if (!this.on2) {
                lightSphere2.material.color.set("rgb(0,90,0)");
            } else {
                lightSphere2.material.color.set("rgb(0,255,0)");
            }
        }

        this.onChangeOn3 = function () {
            spotLight3.visible = this.on3;
            if (!this.on3) {
                lightSphere3.material.color.set("rgb(0,0,90)");
            } else {
                lightSphere3.material.color.set("rgb(0,0,255)");
            }
        }
    };

    var gui = new GUI();
    gui.add(controls, 'ambientLight', true)
        .name("Ambient Light")
        .onChange(function (e) { controls.onEnableAmbientLight() });
    gui.add(controls, 'rotationTeaPot', false)
        .name("Rotate Teapot")
        .onChange(function (e) { controls.onChangeRotationBule() });
    gui.add(controls, 'on1', true)
        .name("Red Light")
        .onChange(function (e) { controls.onChangeOn1() });
    gui.add(controls, 'on2', true)
        .name("Green Light")
        .onChange(function (e) { controls.onChangeOn2() });
    gui.add(controls, 'on3', true)
        .name("Blue Light")
        .onChange(function (e) { controls.onChangeOn3() });
}

function render() {
    stats.update();
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    keyboardUpdate();
    if (rotate)
        obj.rotateY(degreesToRadians(2));
}