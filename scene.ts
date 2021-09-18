import { ProgramWithObjects } from "./program";
import { StandardProgramWithObjects } from "./StandardProgram";
import RenderObject from "./RenderObject";
import * as mat4 from "./gl-matrix/mat4";

export class Scene {
  programs: ProgramWithObjects[];

  view: Float32Array;
  proj: Float32Array;

  constructor() {
    this.programs = [ new StandardProgramWithObjects() ];

    this.view = mat4.create();
    mat4.identity(this.view);
    mat4.translate(this.view, this.view, [0,0,-2]);

    this.proj = mat4.create();
    mat4.perspective(this.proj, 1.074, 16/9, 0.1, 500);
  }

  draw() {
    for (const program of this.programs)
      program.draw(this.view, this.proj);
  }

  addObject(obj: RenderObject) {
    this.programs[0].objects.push(obj);
  }
}
