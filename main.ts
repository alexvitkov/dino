import * as gl from "./gl";
import * as gltf from "./gltf";
import * as scene from "./scene";
import * as input from "./input";
import * as StandardProgram from "./StandardProgram";
import RenderObject from "./RenderObject";


var the_scene: scene.Scene;
var the_monkey: RenderObject;
var monkeyMesh: gltf.Mesh;

let sensitivityX = 100;
let sensitivityY = 100;

let currentFrame = 0;
let dt = 0;
let lastTime = -1/30;
let time: number;

async function main() {
  gl.init();
  StandardProgram.init();
  monkeyMesh = await gltf.load("/assets/monkey.gltf")
  the_scene = new scene.Scene();
  the_scene.cameraPosition[2] = -10;

  the_monkey = new RenderObject();
  the_monkey.mesh = monkeyMesh;

  the_scene.addObject(the_monkey);
  
  engineFrame();
}


function frame() {
  the_scene.cameraYaw += dt * input.axes.mouseX.value() * sensitivityX;
  the_scene.cameraPitch += dt * input.axes.mouseY.value() * sensitivityY;

  the_scene.cameraPosition[2] += dt * input.axes.vertical.value();

  the_scene.updateViewMatrix();
  the_monkey.updateModelMatrix();
}



function engineFrame() {
  time = performance.now();
  dt = (time - lastTime) / 1000;
  lastTime = time;

  gl.gl.clearColor(0,0,0,1);
  gl.gl.clear(gl.gl.DEPTH_BUFFER_BIT | gl.gl.COLOR_BUFFER_BIT);


  frame();

  the_scene.draw();

  currentFrame++;

  input.axes.mouseX.delta = 0;
  input.axes.mouseY.delta = 0;

  window.requestAnimationFrame(engineFrame);
}


main();
