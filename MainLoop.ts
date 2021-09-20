import { gl } from "./GL";
import Scene from "./Scene";
import * as Input from "./Input";

export var currentFrame = 0;
export var dt = 0;
export var time: number;

let lastTime = -1/30;


export function run(frame: () => void) {
  time = performance.now();
  dt = (time - lastTime) / 1000;
  lastTime = time;

  gl.clearColor(0,0,0,1);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  frame();

  Scene.current.draw();

  currentFrame++;

  Input.axes.mouseX.delta = 0;
  Input.axes.mouseY.delta = 0;

  window.requestAnimationFrame(function () { run(frame) });
}
