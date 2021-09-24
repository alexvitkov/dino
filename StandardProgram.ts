import { gl, compileShader, linkProgram, shadow_depth_texture } from "./GL";
import { ProgramWithObjects } from "./ProgramWithObjects";
import Drawable from "./Drawable";
import Scene from "./Scene";
import RenderObject from "./RenderObject";
import * as ShaderSnippet from "./ShaderSnippet";


const vert = compileShader(gl.VERTEX_SHADER, `#version 300 es 
uniform mat4 model;
uniform mat4 viewproj;
uniform vec3 sundir;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;

out vec3 Position;
out vec3 N;
out float PreShadowIntensity;

void main() {
    gl_Position = viewproj * model * vec4(position, 1);

    Position = vec3(model * vec4(position, 1));
    N = mat3(transpose(inverse(model))) * normal;
    PreShadowIntensity = dot(N, sundir) / 2.0 + 0.5;
}
`);

const frag = compileShader(gl.FRAGMENT_SHADER, `#version 300 es 
precision highp float;
uniform samplerCube reflection;
uniform vec3 cameraPosition;
uniform sampler2D shadowmap;
uniform mat4 sun;

in vec3 Position;
in vec3 N;
in float PreShadowIntensity;

out highp vec4 out_color;

void main() {
    // vec3 C = cameraPosition;
    // vec3 I = Position - C;
    // vec3 R = reflect(I, N);
    // out_color = vec4(texture(reflection, R).rgb, 1.0);
` + ShaderSnippet.shadow + `
    out_color = vec4(vec3(1,1,1) * intensity, 1);
}`);

const program = linkProgram(vert, frag);
const modelMatrixLocation = gl.getUniformLocation(program, 'model');
const viewprojMatrixLocation = gl.getUniformLocation(program, 'viewproj');
const sunMatrixLocation = gl.getUniformLocation(program, 'sun');
const cameraPositionLocation = gl.getUniformLocation(program, 'cameraPosition');
const sundirLocation = gl.getUniformLocation(program, 'sundir');
const reflectionCubemapLocation = gl.getUniformLocation(program, 'reflection');
const shadowmapLocation = gl.getUniformLocation(program, 'shadowmap');



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
    gl.uniformMatrix4fv(sunMatrixLocation, false, Scene.current.sunMatrix);

    gl.uniform3fv(cameraPositionLocation, Scene.current.cameraPosition);
    gl.uniform3fv(sundirLocation, sundir);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox);
    gl.uniform1i(reflectionCubemapLocation, 0);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, shadow_depth_texture);
    gl.uniform1i(shadowmapLocation, 2);

    for (const obj of this.objects) {
      gl.bindVertexArray(obj.mesh.vao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indices);
      gl.uniformMatrix4fv(modelMatrixLocation, false, obj.modelMatrix);
      gl.drawElements(gl.TRIANGLES, obj.mesh.numIndices, gl.UNSIGNED_SHORT, 0);
    }
  }
}
