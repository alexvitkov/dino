import { ProgramWithObjects } from "./ProgramWithObjects";
import { StandardProgramWithObjects } from "./StandardProgram";
import { gl, shadow_fbo, shadow_resolution } from "./GL";
import RenderObject from "./RenderObject";
import Drawable from "./Drawable";
import Skybox from "./Skybox";
import * as mat4 from "./gl-matrix/mat4";
import * as Inspector from "./Inspector";
import * as Angle from "./Angle";
import * as Input from "./Input";

export default class Scene {
  drawables: Drawable[] = [
    new StandardProgramWithObjects() 
  ];

  skybox: Skybox;

  // Camera Transform
  cameraPosition = [0,0,0];
  cameraPitch = 0;
  cameraYaw = 0;

  // Sunlight
  sunlightDirection = new Float32Array(3);
  sunlightPitch = 0;
  sunlightYaw = 0;

  // view/projection matrices
  view: Float32Array = mat4.create();
  cameraView: Float32Array = mat4.create();
  proj: Float32Array = mat4.create();
  viewproj: Float32Array = mat4.create();
  projInverse: Float32Array = mat4.create();
  sunMatrix: Float32Array = mat4.create();

  static current = new Scene();

  constructor() {
    mat4.perspective(this.proj, 1.074, 16/9, 0.1, 500);
    mat4.invert(this.projInverse, this.proj);

    this.updateViewMatrix();
  }

  updateViewMatrix() {
    this.cameraYaw = Angle.normalize(this.cameraYaw);

    mat4.identity(this.view);
    mat4.rotateX(this.view, this.view, -this.cameraPitch);
    mat4.rotateY(this.view, this.view, this.cameraYaw);
    mat4.copy(this.cameraView, this.view);
    mat4.translate(this.view, this.view, [-this.cameraPosition[0], -this.cameraPosition[1], -this.cameraPosition[2]]);

    Inspector.set("Camera Position", this.cameraPosition);
    Inspector.set("Camera Pitch", this.cameraPitch * 180/Math.PI);
    Inspector.set("Camera Yaw", this.cameraYaw * 180/Math.PI);

    mat4.multiply(this.viewproj, this.proj, this.view);
    this.updateSunMatrix();
  }

  setSunlightDirection(pitch: number, yaw: number) {
    this.sunlightPitch = pitch;
    this.sunlightYaw = yaw;

    this.sunlightDirection[0] = -Math.sin(yaw) * Math.cos(pitch);
    this.sunlightDirection[1] = -Math.sin(pitch);
    this.sunlightDirection[2] = Math.cos(yaw) * Math.cos(pitch);

    this.updateSunMatrix();
  }

  updateSunMatrix() {
    const size = 10;
    const offset = size * 0.7;

    mat4.ortho(this.sunMatrix, -size, size, -10, 10, -size, size);

    mat4.rotateX(this.sunMatrix, this.sunMatrix, -this.sunlightPitch);
    mat4.rotateY(this.sunMatrix, this.sunMatrix, this.sunlightYaw);

    const t = [
      -this.cameraPosition[0] - offset * Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch),
	-this.cameraPosition[1],
	-this.cameraPosition[2] + offset * Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch),
    ];

    mat4.translate(this.sunMatrix, this.sunMatrix, t);
    // mat4.multiply(this.sunMatrix, this.sunMatrix, this.view);
  }

  draw() {
    let mat = Input.pressed['e'] ? this.sunMatrix : this.viewproj;
    mat = this.viewproj;

    // 
    // Shadow pass
    // 
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadow_fbo);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, shadow_resolution, shadow_resolution);
    for (const ro of this.drawables)
      ro.shadowPass(this.sunMatrix);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, 1280, 720);

    //
    // Render pass
    //
    for (const ro of this.drawables)
      ro.draw(mat, this.skybox.cubemap, this.sunlightDirection as any);

    for (const ro of this.drawables)
      ro.draw(mat, this.skybox.cubemap, this.sunlightDirection as any);

    if (this.skybox)
      this.skybox.draw(this.cameraView, this.proj, this.sunlightDirection);
  }

  addRenderObject(obj: RenderObject) {
    (this.drawables[0] as ProgramWithObjects).objects.push(obj);
  }

  addDrawable(obj: Drawable) {
    this.drawables.push(obj);
  }
}
