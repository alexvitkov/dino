import { ProgramWithObjects } from "./program";
import { StandardProgramWithObjects } from "./StandardProgram";
import RenderObject from "./RenderObject";
import * as mat4 from "./gl-matrix/mat4";

export class Scene {
  programs: ProgramWithObjects[];

  cameraPosition = [0,0,0];
  cameraPitch = 0;
  cameraYaw = 0;

  view: Float32Array = mat4.create();
  proj: Float32Array = mat4.create();

  constructor() {
    this.programs = [ new StandardProgramWithObjects() ];

    mat4.perspective(this.proj, 1.074, 16/9, 0.1, 500);
    this.updateViewMatrix();
  }

  updateViewMatrix() {
    mat4.identity(this.view);
    mat4.rotateX(this.view, this.view, this.cameraPitch);
    mat4.rotateY(this.view, this.view, this.cameraYaw);
    mat4.translate(this.view, this.view, [this.cameraPosition[0],this.cameraPosition[1],this.cameraPosition[2]]);
  }

  draw() {
    for (const program of this.programs)
      program.draw(this.view, this.proj);
  }

  addObject(obj: RenderObject) {
    this.programs[0].objects.push(obj);
  }
}
