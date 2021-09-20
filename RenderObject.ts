import { Mesh } from "./GLTF";
import * as mat4 from "./gl-matrix/mat4";

export default class RenderObject {
  position: Float32Array = new Float32Array(3);
  pitch: number = 0;
  yaw: number = 0;

  modelMatrix: Float32Array = mat4.create();

  constructor(public mesh: Mesh) {}

  updateModelMatrix() {
    mat4.identity(this.modelMatrix);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotateY(this.modelMatrix, this.modelMatrix, this.yaw);
    mat4.rotateX(this.modelMatrix, this.modelMatrix, this.pitch);
  }
}
