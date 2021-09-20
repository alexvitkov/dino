import { gl, compileShader, linkProgram } from "./GL";
import Drawable from "./Drawable";

const vao = gl.createVertexArray();
const vertices = gl.createBuffer();
const indices = gl.createBuffer();

gl.bindVertexArray(vao);

gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//X,Y,Z,R,G,B
  0,0,0,1,0,0,
  0,0,0,0,1,0,
  0,0,0,0,0,1,
  1,0,0,1,0,0,
  0,1,0,0,1,0,
  0,0,1,0,0,1
]), gl.STATIC_DRAW);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
  0,3,1,4,2,5
]), gl.STATIC_DRAW);

gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);

gl.bindVertexArray(null);


const vert = compileShader(gl.VERTEX_SHADER, `#version 300 es
uniform mat4 view;
uniform mat4 proj;

in vec3 position;
in vec3 color;

out vec3 _color;

void main() {
    gl_Position = proj * view * vec4(position,1);
    _color = color;
}
`);

const frag = compileShader(gl.FRAGMENT_SHADER, `#version 300 es
in highp vec3 _color;

out highp vec4 out_color;

void main() {
    out_color = vec4(_color, 1);
}
`);

const program = linkProgram(vert, frag);
const projMatrixLocation = gl.getUniformLocation(program, "proj");
const viewMatrixLocation = gl.getUniformLocation(program, "view");

export default class MoveGizmo implements Drawable {

  draw(view, proj) {
    gl.useProgram(program);
    gl.lineWidth(10);

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);

    gl.uniformMatrix4fv(projMatrixLocation, false, proj);
    gl.uniformMatrix4fv(viewMatrixLocation, false, view);

    gl.bindVertexArray(vao);
    gl.drawElements(gl.LINES, 6, gl.UNSIGNED_SHORT, 0);
  }
}
