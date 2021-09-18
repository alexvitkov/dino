export var gl: WebGL2RenderingContext;
export var canvas: HTMLCanvasElement;

export function init() {
  canvas = document.getElementById("dino_canvas") as HTMLCanvasElement;
  if (!canvas)
    throw "canvas with id dino_canvas doesn't exist";

  gl = canvas.getContext("webgl2");
  if (!gl)
    throw "webgl 2 not supported";

  canvas.onmousedown = () => canvas.requestPointerLock();

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
}

export function compileShader(type: GLenum, source: string): WebGLShader {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const log = gl.getShaderInfoLog(shader);
  if (log !== "") {
    alert("Shader compile error\n" + log);
    throw 'failed to compile shader';
  }

  return shader;
}

export function linkProgram(vert: WebGLShader, frag: WebGLShader): WebGLProgram {
  const prog = gl.createProgram();

  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);

  const log = gl.getProgramInfoLog(prog);

  if (log !== "") {
    alert("Program link error\n" + log);
    throw 'failed to link program';
  }

  return prog;
}
