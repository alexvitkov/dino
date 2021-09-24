export var gl: WebGL2RenderingContext;
export var canvas: HTMLCanvasElement = document.getElementById("dino_canvas") as HTMLCanvasElement;;

const shadow_resolution = 256;

//
// WebGL Initialization
//
if (!canvas)
  throw "canvas with id dino_canvas doesn't exist";

gl = canvas.getContext("webgl2");
if (!gl)
  throw "webgl 2 not supported";

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);

gl.enable(gl.CULL_FACE);
void gl.cullFace(gl.BACK);



// Shadows
export var shadow_fbo = gl.createFramebuffer();

gl.bindFramebuffer(gl.FRAMEBUFFER, shadow_fbo);

const shadow_color_texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, shadow_color_texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, shadow_resolution, shadow_resolution, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadow_color_texture, 0);

const shadow_depth_texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, shadow_depth_texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, shadow_resolution, shadow_resolution, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shadow_color_texture, 0);

gl.bindFramebuffer(gl.FRAMEBUFFER, null);




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
