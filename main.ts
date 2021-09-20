import * as GLTF from "./GLTF";
import * as Input from "./Input";
import * as Camera from "./Camera";
import * as MainLoop from "./MainLoop";
import RenderObject from "./RenderObject";
import Scene from "./Scene";
import MoveGizmo from "./MoveGizmo";
import Skybox from "./Skybox";

function frame() {
  if (Input.hasPointerLock) {
    Camera.mouseLookStep(Scene.current);
    Camera.cameraFlyStep(Scene.current);
    Scene.current.updateViewMatrix();
  }
}

(async function () {
  await Skybox.init();


  const monkeyMesh = await GLTF.load("/assets/monkey.gltf")

  Scene.current.cameraPosition[2] = -10;
  Scene.current.updateViewMatrix();

  const obj1 = new RenderObject(monkeyMesh);
  obj1.position = new Float32Array([-6,0,0]);
  obj1.updateModelMatrix();
  Scene.current.addRenderObject(obj1);

  const obj2 = new RenderObject(monkeyMesh);
  obj2.position = new Float32Array([6,0,0]);
  obj2.updateModelMatrix();
  Scene.current.addRenderObject(obj2);

  Scene.current.addDrawable(new MoveGizmo());

  Scene.current.skybox = new Skybox(
    "assets/negx.jpg",
    "assets/posx.jpg",
    "assets/negy.jpg",
    "assets/posy.jpg",
    "assets/negz.jpg",
    "assets/posz.jpg"
  );
  
  MainLoop.run(frame);
})()
