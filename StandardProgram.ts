import { gl, compileShader, linkProgram } from "./GL";
import { ProgramWithObjects } from "./ProgramWithObjects";
import Drawable from "./Drawable";
import Scene from "./Scene";
import RenderObject from "./RenderObject";


const vert = compileShader(gl.VERTEX_SHADER, `#version 300 es 
uniform mat4 model;
uniform mat4 viewproj;
uniform vec3 sundir;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;

out vec3 P;
out vec3 N;
out float intensity;

void main() {
    gl_Position = viewproj * model * vec4(position, 1);

    P = vec3(model * vec4(position, 1));
    N = mat3(transpose(inverse(model))) * normal;
    intensity = dot(N, sundir) / 2.0 + 0.5;
}
`);

const frag = compileShader(gl.FRAGMENT_SHADER, `#version 300 es 
precision highp float;
uniform samplerCube reflection;
uniform vec3 cameraPosition;

in vec3 P;
in vec3 N;
in float intensity;

out highp vec4 out_color;

void main() {
    // vec3 C = cameraPosition;
    // vec3 I = P - C;
    // vec3 R = reflect(I, N);
    // out_color = vec4(texture(reflection, R).rgb, 1.0);

    out_color = vec4(vec3(1,1,1) * intensity, 1);
}`);

const program = linkProgram(vert, frag);
const modelMatrixLocation = gl.getUniformLocation(program, 'model');
const viewprojMatrixLocation = gl.getUniformLocation(program, 'viewproj');
const cameraPositionLocation = gl.getUniformLocation(program, 'cameraPosition');
const sundirLocation = gl.getUniformLocation(program, 'sundir');
const reflectionCubemapLocation = gl.getUniformLocation(program, 'reflection');



const shadow_vert = compileShader(gl.VERTEX_SHADER, `#version 300 es 
uniform mat4 mat;
uniform mat4 model;
layout (location = 0) in vec3 position;

void main() {
    gl_Position = mat * model * vec4(position, 1);
}
`);

const shadow_frag = compileShader(gl.FRAGMENT_SHADER, `#version 300 es 
out highp vec4 out_color;
void main() {
    out_color = vec4(1,0,0,1);
}`)


const shadow_program = linkProgram(shadow_vert, shadow_frag);
const shadow_matLocation = gl.getUniformLocation(shadow_program, 'mat');
const shadow_modelMatrixLocation = gl.getUniformLocation(shadow_program, 'model');


export class StandardProgramWithObjects implements ProgramWithObjects {
  objects: RenderObject[] = [];

  shadowPass(mat: Float32Array) {
    gl.useProgram(shadow_program);

    gl.uniformMatrix4fv(shadow_matLocation, false, mat);

    for (const obj of this.objects) {
      gl.bindVertexArray(obj.mesh.vao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indices);
      gl.uniformMatrix4fv(shadow_modelMatrixLocation, false, obj.modelMatrix);
      gl.drawElements(gl.TRIANGLES, obj.mesh.numIndices, gl.UNSIGNED_SHORT, 0);
    }
  }

  draw(viewproj: Float32Array, skybox: WebGLTexture, sundir: [number,number,number]) {
    gl.useProgram(program);

    gl.uniformMatrix4fv(viewprojMatrixLocation, false, viewproj);

    gl.uniform3fv(cameraPositionLocation, Scene.current.cameraPosition);
    gl.uniform3fv(sundirLocation, sundir);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox);
    gl.uniform1i(reflectionCubemapLocation, 0);

    for (const obj of this.objects) {
      gl.bindVertexArray(obj.mesh.vao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indices);
      gl.uniformMatrix4fv(modelMatrixLocation, false, obj.modelMatrix);
      gl.drawElements(gl.TRIANGLES, obj.mesh.numIndices, gl.UNSIGNED_SHORT, 0);
    }
  }
}
