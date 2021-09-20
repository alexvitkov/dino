import RenderObject from "./RenderObject";
import Drawable from "./Drawable";

export interface ProgramWithObjects extends Drawable {
  objects: RenderObject[];
}
