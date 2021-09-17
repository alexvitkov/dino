import { gl, compileShader, linkProgram } from "./gl";
import RenderObject from "./RenderObject";

var program: WebGLProgram;
var modelMatrixLocation: WebGLUniformLocation;
var viewMatrixLocation: WebGLUniformLocation;
var projMatrixLocation: WebGLUniformLocation;

export function init() {
  const vert = compileShader(gl.VERTEX_SHADER, `#version 300 es 
uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

in vec3 position;
in vec3 normal;

out vec3 _normal;

void main() {
    _normal = normal;
    gl_Position = proj * view * model * vec4(position / 3.0, 1);
}
`);

  const frag = compileShader(gl.FRAGMENT_SHADER, `#version 300 es 
in highp vec3 _normal;

out highp vec4 out_color;

void main() {
    out_color = vec4(_normal / 2.0 + vec3(0.5, 0.5, 0.5), 1);
}
`);

  program = linkProgram(vert, frag);

  modelMatrixLocation = gl.getUniformLocation(program, 'model');
  viewMatrixLocation = gl.getUniformLocation(program, 'view');
  projMatrixLocation = gl.getUniformLocation(program, 'proj');
}


export class StandardProgramWithObjects {
  objects: RenderObject[] = [];

  draw(view: Float32Array, proj: Float32Array) {
    gl.useProgram(program);

    gl.uniformMatrix4fv(projMatrixLocation, false, proj);
    gl.uniformMatrix4fv(viewMatrixLocation, false, view);

    for (const obj of this.objects) {
      gl.bindVertexArray(obj.mesh.vao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indices);
      gl.uniformMatrix4fv(modelMatrixLocation, false, obj.modelMatrix);
      gl.drawElements(gl.TRIANGLES, obj.mesh.numIndices, gl.UNSIGNED_SHORT, 0);
    }
  }
}