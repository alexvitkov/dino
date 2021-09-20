import * as GL from "./GL";
import * as GLTF from "./GLTF";
import * as Input from "./Input";
import * as CameraMovement from "./CameraMovement";
import RenderObject from "./RenderObject";
import Scene from "./Scene";

const theScene: Scene = new Scene();
var theMonkey;


let currentFrame = 0;
let dt = 0;
let lastTime = -1/30;
let time: number;

function frame() {
  if (Input.hasPointerLock) {
    CameraMovement.mouseLookStep(theScene, dt);
    CameraMovement.cameraFlyStep(theScene, dt);
  }

  theScene.updateViewMatrix();
  theMonkey.updateModelMatrix();
}



function engineFrame() {
  time = performance.now();
  dt = (time - lastTime) / 1000;
  lastTime = time;

  GL.gl.clearColor(0,0,0,1);
  GL.gl.clear(GL.gl.DEPTH_BUFFER_BIT | GL.gl.COLOR_BUFFER_BIT);

  frame();

  theScene.draw();

  currentFrame++;

  Input.axes.mouseX.delta = 0;
  Input.axes.mouseY.delta = 0;

  window.requestAnimationFrame(engineFrame);
}


(async function () {
  const monkeyMesh = await GLTF.load("/assets/monkey.gltf")
  theScene.cameraPosition[2] = -10;

  theMonkey = new RenderObject(monkeyMesh);

  theScene.addObject(theMonkey);
  
  engineFrame();
})()
