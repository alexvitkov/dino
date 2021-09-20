import { gl } from "./GL";
import Scene from "./Scene";
import * as Input from "./Input";
import * as Time from "./Time";

export function run(frame: () => void) {
  gl.clearColor(0,0,0,1);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  Time.onNewFrame();
  frame();

  Scene.current.draw();


  Input.axes.mouseX.delta = 0;
  Input.axes.mouseY.delta = 0;

  window.requestAnimationFrame(function () { run(frame) });
}
