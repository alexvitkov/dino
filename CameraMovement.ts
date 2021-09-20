import * as Input from "./Input";
import * as vec3 from "./gl-matrix/vec3";
import { Scene } from "./Scene";


let flySpeed = 5;

let sensitivityX = 100;
let sensitivityY = 100;


export function mouseLookStep(the_scene: Scene, dt) {
  the_scene.cameraYaw += dt * Input.axes.mouseX.value() * sensitivityX;
  the_scene.cameraPitch += dt * Input.axes.mouseY.value() * sensitivityY;
}


export function cameraFlyStep(the_scene: Scene, dt) {

  let h = -Input.axes.horizontal.value();
  let v = Input.axes.vertical.value();

  let sinh = Math.sin(the_scene.cameraYaw);
  let cosh = Math.cos(the_scene.cameraYaw);
  let sinv = Math.sin(the_scene.cameraPitch);
  let cosv = Math.cos(the_scene.cameraPitch);

  let vec = [
    (cosh * h - sinh * v) * cosv,
    v * sinv,
    (sinh * h + cosh * v) * cosv,
  ];

  let len = vec3.length(vec);
  if (len > 0.01) {
    vec[0] *= dt * flySpeed / len;
    vec[1] *= dt * flySpeed / len;
    vec[2] *= dt * flySpeed / len;
  }

  vec3.add(the_scene.cameraPosition, the_scene.cameraPosition, vec);
}
