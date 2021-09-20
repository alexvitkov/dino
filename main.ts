import * as GLTF from "./GLTF";
import * as Input from "./Input";
import * as CameraMovement from "./CameraMovement";
import * as MainLoop from "./MainLoop";
import RenderObject from "./RenderObject";
import Scene from "./Scene";

function frame() {
  if (Input.hasPointerLock) {
    CameraMovement.mouseLookStep(Scene.current, MainLoop.dt);
    CameraMovement.cameraFlyStep(Scene.current, MainLoop.dt);
    Scene.current.updateViewMatrix();
  }
}

(async function () {
  const monkeyMesh = await GLTF.load("/assets/monkey.gltf")

  Scene.current.cameraPosition[2] = -10;
  Scene.current.updateViewMatrix();

  Scene.current.addObject(new RenderObject(monkeyMesh));
  
  MainLoop.run(frame);
})()
