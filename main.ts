import * as gl from "./gl";
import * as gltf from "./gltf";
import * as scene from "./scene";
import * as StandardProgram from "./StandardProgram";
import RenderObject from "./RenderObject";

var the_scene: scene.Scene;
var the_monkey: RenderObject;
var monkeyMesh: gltf.Mesh;

let currentFrame = 0;
let dt = 0;
let lastTime = -1/30;
let time: number;

async function main() {
  gl.init();
  StandardProgram.init();
  monkeyMesh = await gltf.load("/assets/monkey.gltf")
  the_scene = new scene.Scene();

  the_monkey = new RenderObject();
  the_monkey.mesh = monkeyMesh;

  the_scene.addObject(the_monkey);
  
  frame();
}





function frame() {
  time = performance.now();
  dt = time - lastTime;
  lastTime = time;

  gl.gl.clearColor(0,0,0,1);
  gl.gl.clear(gl.gl.DEPTH_BUFFER_BIT | gl.gl.COLOR_BUFFER_BIT);

  the_scene.draw();
  the_monkey.updateModelMatrix();

  window.requestAnimationFrame(frame);

  currentFrame++;
}


main();
