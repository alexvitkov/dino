import * as gl from "./gl";
import * as gltf from "./gltf";





async function main() {
  gl.init();
  const monkey = await gltf.load("/assets/monkey.gltf")

  const vert = gl.compileShader(gl.gl.VERTEX_SHADER, `#version 300 es 
in vec3 position;
in vec3 normal;

out vec3 _normal;

void main() {
    _normal = normal;
    gl_Position = vec4(position / 3.0, 1);
}
`);

  const frag = gl.compileShader(gl.gl.FRAGMENT_SHADER, `#version 300 es 
in highp vec3 _normal;

out highp vec4 out_color;

void main() {
    out_color = vec4(_normal / 2.0 + vec3(0.5, 0.5, 0.5), 1);
}
`);


  const prog = gl.linkProgram(vert, frag);

  gl.gl.useProgram(prog);

  gl.gl.clearColor(0,0,0,1);
  gl.gl.clear(gl.gl.DEPTH_BUFFER_BIT | gl.gl.COLOR_BUFFER_BIT);

  monkey.draw();
}


main();
