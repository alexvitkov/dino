import RenderObject from "./RenderObject";

export interface ProgramWithObjects {
  objects: RenderObject[];

  draw(view: Float32Array, proj: Float32Array): void;
}
