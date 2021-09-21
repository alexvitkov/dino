import * as GLTF from "./GLTF";
import * as Input from "./Input";
import * as Camera from "./Camera";
import * as MainLoop from "./MainLoop";
import RenderObject from "./RenderObject";
import Scene from "./Scene";
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


  const monkeyMesh = await GLTF.load("/assets/cube.gltf")

  Scene.current.cameraPosition[1] = 0;
  Scene.current.cameraPosition[2] = 5;
  Scene.current.updateViewMatrix();

  const obj1 = new RenderObject(monkeyMesh);
  obj1.position = new Float32Array([0, 0, 0]);
  obj1.updateModelMatrix();
  Scene.current.addRenderObject(obj1);

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
