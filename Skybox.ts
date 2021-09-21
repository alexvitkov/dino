import Drawable from "./Drawable";
import * as GLTF from "./GLTF";
import { gl, compileShader, linkProgram } from "./GL";

var skyboxCubeMesh: GLTF.Mesh;

const vert = compileShader(gl.VERTEX_SHADER, `#version 300 es
uniform mat4 view;
uniform mat4 proj;

layout (location = 0) in vec3 position;

out vec3 _position;

void main() {
    gl_Position = (proj * view * vec4(position,1)).xyww;
    _position = position;
}
`);

const frag = compileShader(gl.FRAGMENT_SHADER, `#version 300 es
in highp vec3 _position;
out highp vec4 out_color;

uniform samplerCube cube;

void main() {
    out_color = texture(cube, _position);
}
`);

const program = linkProgram(vert, frag);
const projMatrixLocation = gl.getUniformLocation(program, "proj");
const viewMatrixLocation = gl.getUniformLocation(program, "view");
const cubeLocation = gl.getUniformLocation(program, "cube");


function loadImage(bindpoint: GLenum, path: string, onload, pixel): HTMLImageElement {
  const img = new Image();

  //const texture = gl.createTexture();
  gl.texImage2D(bindpoint, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(pixel));
  img.onload = onload;
  img.src = path;

  return img;
}


export default class Skybox implements Drawable {
  cubemap: WebGLTexture;

  static async init() {
    skyboxCubeMesh = await GLTF.load("assets/skybox.gltf");
  }

  constructor(negx: string, posx: string, negy: string, posy: string, negz: string, posz: string) {

    let that = this;
    this.cubemap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemap);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


    let done = 0;
    const onload = () => {
      done++;

      if (done == 6) {
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, that.cubemap);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_negx);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_posx);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_negy);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_posy);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_negz);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_posz);
      }
    }

    const pixel = [46, 133, 201, 255];
    const img_negx = loadImage(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, negx, onload, pixel);
    const img_posx = loadImage(gl.TEXTURE_CUBE_MAP_POSITIVE_X, posx, onload, pixel);
    const img_negy = loadImage(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, negy, onload, pixel);
    const img_posy = loadImage(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, posy, onload, pixel);
    const img_negz = loadImage(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, negz, onload, pixel);
    const img_posz = loadImage(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, posz, onload, pixel);
  }

  draw(view: any, proj: any): void {
    if (!skyboxCubeMesh)
      return;

    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemap);
    gl.uniform1i(cubeLocation, 0);

    gl.bindVertexArray(skyboxCubeMesh.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxCubeMesh.indices);

    gl.uniformMatrix4fv(projMatrixLocation, false, proj);
    gl.uniformMatrix4fv(viewMatrixLocation, false, view);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  }

}
