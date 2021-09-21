import { ProgramWithObjects } from "./ProgramWithObjects";
import { StandardProgramWithObjects } from "./StandardProgram";
import RenderObject from "./RenderObject";
import Drawable from "./Drawable";
import Skybox from "./Skybox";
import * as mat4 from "./gl-matrix/mat4";

export default class Scene {
  drawables: Drawable[] = [
    new StandardProgramWithObjects() 
  ];

  skybox: Skybox;

  cameraPosition = [0,0,0];
  cameraPitch = 0;
  cameraYaw = 0;

  view: Float32Array = mat4.create();
  cameraView: Float32Array = mat4.create();
  proj: Float32Array = mat4.create();
  projInverse: Float32Array = mat4.create();

  static current = new Scene();

  constructor() {
    mat4.perspective(this.proj, 1.074, 16/9, 0.1, 500);
    mat4.invert(this.projInverse, this.proj);

    this.updateViewMatrix();
  }

  updateViewMatrix() {
    mat4.identity(this.view);
    mat4.rotateX(this.view, this.view, this.cameraPitch);
    mat4.rotateY(this.view, this.view, this.cameraYaw);
    mat4.copy(this.cameraView, this.view);
    mat4.translate(this.view, this.view, [-this.cameraPosition[0], -this.cameraPosition[1], -this.cameraPosition[2]]);
  }

  draw() {
    for (const ro of this.drawables)
      ro.draw(this.view, this.proj, this.skybox.cubemap);

    if (this.skybox)
      this.skybox.draw(this.cameraView, this.proj);
  }

  addRenderObject(obj: RenderObject) {
    (this.drawables[0] as ProgramWithObjects).objects.push(obj);
  }

  addDrawable(obj: Drawable) {
    this.drawables.push(obj);
  }
}
