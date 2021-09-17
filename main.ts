import * as gl from "./gl";
import * as gltf from "./gltf";
import * as mat4 from "./mat4";


var monkey;
var prog;
var loc;

async function main() {
  gl.init();

  monkey = await gltf.load("/assets/monkey.gltf")

  const vert = gl.compileShader(gl.gl.VERTEX_SHADER, `#version 300 es 

uniform mat4 the_matrix;

in vec3 position;
in vec3 normal;

out vec3 _normal;

void main() {
    _normal = normal;
    gl_Position = the_matrix * vec4(position / 3.0, 1);
}
`);

  const frag = gl.compileShader(gl.gl.FRAGMENT_SHADER, `#version 300 es 
in highp vec3 _normal;

out highp vec4 out_color;

void main() {
    out_color = vec4(_normal / 2.0 + vec3(0.5, 0.5, 0.5), 1);
}
`);


  prog = gl.linkProgram(vert, frag);
  loc = gl.gl.getUniformLocation(prog, 'the_matrix');

  frame();
}


let currentFrame = 0;
let dt = 0;
let lastTime = -1/30;
let time: number;


const the_matrix = mat4.make();
mat4.identity(the_matrix);

function frame() {
  time = performance.now()
  ;
  dt = time - lastTime;
  lastTime = time;

  mat4.rotate_x(the_matrix, 0.01);
  mat4.rotate_y(the_matrix, 0.01);
 
  gl.gl.useProgram(prog);
  gl.gl.uniformMatrix4fv(loc, false, the_matrix);

  gl.gl.clearColor(0,0,0,1);
  gl.gl.clear(gl.gl.DEPTH_BUFFER_BIT | gl.gl.COLOR_BUFFER_BIT);

  monkey.draw();

  window.requestAnimationFrame(frame);

  currentFrame++;
}


main();
