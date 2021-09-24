import { ProgramWithObjects } from "./ProgramWithObjects";
import { StandardProgramWithObjects } from "./StandardProgram";
import RenderObject from "./RenderObject";
import Drawable from "./Drawable";
import Skybox from "./Skybox";
import * as mat4 from "./gl-matrix/mat4";
import * as Inspector from "./Inspector";
import * as Angle from "./Angle";

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
  projInverse: Float32Array = mat4.create();
  sunMatrix: Float32Array = mat4.create();

  static current = new Scene();

  constructor() {
    mat4.perspective(this.proj, 1.074, 16/9, 0.1, 500);
    mat4.invert(this.projInverse, this.proj);

    this.updateViewMatrix();
  }

  updateViewMatrix() {
    // this.cameraYaw = Angle.normalize(this.cameraYaw);

    mat4.identity(this.view);
    mat4.rotateX(this.view, this.view, -this.cameraPitch);
    mat4.rotateY(this.view, this.view, this.cameraYaw);
    mat4.copy(this.cameraView, this.view);
    mat4.translate(this.view, this.view, [-this.cameraPosition[0], -this.cameraPosition[1], -this.cameraPosition[2]]);

    Inspector.set("Camera Position", this.cameraPosition);
    Inspector.set("Camera Pitch", this.cameraPitch * 180/Math.PI);
    Inspector.set("Camera Yaw", this.cameraYaw * 180/Math.PI);

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
    mat4.multiply(this.sunMatrix, this.proj, this.view);
  }

  draw() {

    for (const ro of this.drawables)
      ro.shadowPass(this.sunMatrix);

    /*
    for (const ro of this.drawables)
      ro.draw(this.view, this.proj, this.skybox.cubemap, this.sunlightDirection as any);

    for (const ro of this.drawables)
      ro.draw(this.view, this.proj, this.skybox.cubemap, this.sunlightDirection as any);

    if (this.skybox)
      this.skybox.draw(this.cameraView, this.proj, this.sunlightDirection);
      */
  }

  addRenderObject(obj: RenderObject) {
    (this.drawables[0] as ProgramWithObjects).objects.push(obj);
  }

  addDrawable(obj: Drawable) {
    this.drawables.push(obj);
  }
}
