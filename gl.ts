var canvas: HTMLCanvasElement;
var gl: WebGL2RenderingContext;

export function init() {
  canvas = document.getElementById("dino_canvas") as HTMLCanvasElement;
  if (!canvas)
    throw "canvas with id dino_canvas doesn't exist";

  gl = canvas.getContext("webgl2");
  if (!gl)
    throw "webgl 2 not supported";
}

export function mainLoop() {
  gl.clearColor(1,0,0,1);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  window.requestAnimationFrame(mainLoop);
}
