import { gl, compileShader, linkProgram } from "./GL";
import Drawable from "./Drawable";
import * as Texture from "./Texture";

const terrainMeshes: {[key: number]: TerrainMesh } = {};

const vert = compileShader(gl.VERTEX_SHADER, `#version 300 es 

layout (location = 0) in vec2 position;

uniform sampler2D heightmap;
uniform sampler2D tex;
uniform vec2 scale;

uniform mat4 view;
uniform mat4 proj;

out vec2 _position;
out float y;
out vec3 N;

void main() {
    y = texture(heightmap, position).r;

    vec3 off = vec3(1.0, 1.0, 0.0) / 200.0;
    float hL = texture(heightmap, position - off.xz).r;
    float hR = texture(heightmap, position + off.xz).r;
    float hD = texture(heightmap, position - off.zy).r;
    float hU = texture(heightmap, position + off.zy).r;

    N.x = hL - hR;
    N.z = hD - hU;
    N.y = 2.0 / 200.0;
    N = normalize(N);

    _position = vec2(position.x, position.y); 
    gl_Position = proj * view * vec4(scale.x * position.x, scale.y * y, scale.x * position.y, 1);
}
`);

const frag = compileShader(gl.FRAGMENT_SHADER, `#version 300 es 
precision highp float;

uniform sampler2D heightmap;
uniform sampler2D tex;

in float y;
in vec2 _position;
in vec3 N;

out vec4 out_color;

void main() {
    float light = N.x / 2.0 + 0.5;
    vec4 diffuse = texture(tex, _position * 20.0);

    out_color = light * diffuse +
       + (1.0 - light) * diffuse * vec4(0.7,0.7,0.9,1);
}
`);

const program = linkProgram(vert, frag);

const viewMatrixLocation = gl.getUniformLocation(program, 'view');
const projMatrixLocation = gl.getUniformLocation(program, 'proj');
const heightmapLocation = gl.getUniformLocation(program, 'heightmap');
const textureLocation = gl.getUniformLocation(program, 'tex');
const scaleLocation = gl.getUniformLocation(program, 'scale');

export function getTerrainMesh(resolution: number): TerrainMesh {
  if (resolution in terrainMeshes)
    return terrainMeshes[resolution];
  return (terrainMeshes[resolution] = new TerrainMesh(resolution));
}

export class TerrainMesh {
  vao: WebGLVertexArrayObject;

  indices: WebGLBuffer;
  vertices: WebGLBuffer;
  numIndices: number;

  constructor(resolution: number) {

    const verticesData = [];
    const indicesData = [];

    for (let y = 0; y < resolution; y++)
      for (let x = 0; x < resolution; x++)
	verticesData.push(x / (resolution - 1), y / (resolution - 1));


    for (let i = 0; i < resolution - 1; i++)
      for (let j = 0; j < resolution - 1; j++) {
	// FIXME
	indicesData.push(i*resolution + j, (i+1)*resolution + j, i*resolution + j + 1);
	indicesData.push(i*resolution + j + 1, (i+1)*resolution + j, (i+1)*resolution + j + 1);
      }

    this.numIndices = indicesData.length;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    this.vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesData), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesData), gl.STATIC_DRAW);


  }

  draw() {
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
  }
};



export default class Terrain implements Drawable {

  heightmap: WebGLTexture;
  texture: WebGLTexture;
  terrainMesh: TerrainMesh;
  ready = false;

  constructor(heightmapPath: string, texturePath: string, public resolution: number, public height: number) {
    this.terrainMesh = getTerrainMesh(resolution);
    this.heightmap = gl.createTexture();
    this.texture = Texture.load(texturePath);
    let that = this;

    const img = new Image();
    img.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, that.heightmap);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      that.ready = true;
    }
    img.src = heightmapPath;
  }

  draw(view: any, proj: any, _skybox: WebGLTexture): void {
    if (!this.ready)
      return;

    gl.useProgram(program);

    gl.uniformMatrix4fv(projMatrixLocation, false, proj);
    gl.uniformMatrix4fv(viewMatrixLocation, false, view);
    gl.uniform2f(scaleLocation, this.resolution, this.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.heightmap);
    gl.uniform1i(heightmapLocation, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(textureLocation, 1);

    this.terrainMesh.draw();
  }

}
