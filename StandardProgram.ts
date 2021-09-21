import { gl, compileShader, linkProgram } from "./GL";
import { ProgramWithObjects } from "./ProgramWithObjects";
import Drawable from "./Drawable";
import Scene from "./Scene";
import RenderObject from "./RenderObject";


const vert = compileShader(gl.VERTEX_SHADER, `#version 300 es 
uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;

out vec3 P;
out vec3 N;

void main() {
    gl_Position = proj * view * model * vec4(position, 1);

    P = vec3(model * vec4(position, 1));
    N = mat3(transpose(inverse(model))) * normal;
}
`);

const frag = compileShader(gl.FRAGMENT_SHADER, `#version 300 es 
precision highp float;
uniform samplerCube reflection;
uniform mat4 model;
uniform mat4 view;
uniform vec3 cameraPosition;
uniform mat4 proj;

in vec3 P;
in vec3 N;

out highp vec4 out_color;

void main() {

    vec3 C = cameraPosition;
    vec3 I = P - C;

    vec3 R = reflect(I, N);


    out_color = vec4(texture(reflection, R).rgb, 1.0);
    // out_color = vec4(I.x, I.x, I.x, 1);
}

`);

const program = linkProgram(vert, frag);
const modelMatrixLocation = gl.getUniformLocation(program, 'model');
const viewMatrixLocation = gl.getUniformLocation(program, 'view');
const projMatrixLocation = gl.getUniformLocation(program, 'proj');
const cameraPositionLocation = gl.getUniformLocation(program, 'cameraPosition');

const reflectionCubemapLocation = gl.getUniformLocation(program, 'reflection');


export class StandardProgramWithObjects implements ProgramWithObjects {
  objects: RenderObject[] = [];

  draw(view: Float32Array, proj: Float32Array, skybox: WebGLTexture) {
    gl.useProgram(program);

    gl.uniformMatrix4fv(projMatrixLocation, false, proj);
    gl.uniformMatrix4fv(viewMatrixLocation, false, view);

    for (const obj of this.objects) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox);
      gl.uniform1i(reflectionCubemapLocation, 0);
      gl.uniform3fv(cameraPositionLocation, Scene.current.cameraPosition);

      gl.bindVertexArray(obj.mesh.vao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indices);
      gl.uniformMatrix4fv(modelMatrixLocation, false, obj.modelMatrix);
      gl.drawElements(gl.TRIANGLES, obj.mesh.numIndices, gl.UNSIGNED_SHORT, 0);
    }
  }
}
