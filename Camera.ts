import * as Input from "./Input";
import * as vec3 from "./gl-matrix/vec3";
import * as Time from "./Time";
import Scene from "./Scene";


let flySpeed = 5;

let sensitivityX = 100;
let sensitivityY = 100;

const minPitch = -90 * (Math.PI / 180);
const maxPitch =  90 * (Math.PI / 180);


export function mouseLookStep(the_scene: Scene) {
  the_scene.cameraYaw += Time.deltaTime * Input.axes.mouseX.value() * sensitivityX;
  the_scene.cameraPitch += Time.deltaTime * Input.axes.mouseY.value() * sensitivityY;

  if (the_scene.cameraPitch < minPitch)
    the_scene.cameraPitch = minPitch;

  if (the_scene.cameraPitch > maxPitch)
    the_scene.cameraPitch = maxPitch;
}


export function cameraFlyStep(the_scene: Scene) {
  let h = -Input.axes.horizontal.value();
  let v = Input.axes.vertical.value();

  let sinh = Math.sin(the_scene.cameraYaw);
  let cosh = Math.cos(the_scene.cameraYaw);
  let sinv = Math.sin(the_scene.cameraPitch);
  let cosv = Math.cos(the_scene.cameraPitch);

  let vec = [
    -(cosh * h - sinh * v) * cosv,
    -v * sinv,
    -(sinh * h + cosh * v) * cosv,
  ];

  let len = vec3.length(vec);
  if (len > 0.01) {
    vec[0] *= Time.deltaTime * flySpeed / len;
    vec[1] *= Time.deltaTime * flySpeed / len;
    vec[2] *= Time.deltaTime * flySpeed / len;
  }

  vec3.add(the_scene.cameraPosition, the_scene.cameraPosition, vec);
}


//export function screenToWorldPoint(x, y) {
//  const vec = [x,y,1,1];
//  vec3.transformMat4(vec, vec, Scene.current.projInverse);
//  console.log(vec);
//}
