import * as GLTF from "./GLTF";
import * as Input from "./Input";
import * as Camera from "./Camera";
import * as MainLoop from "./MainLoop";
import RenderObject from "./RenderObject";
import Scene from "./Scene";
import Skybox from "./Skybox";
import Terrain from "./Terrain";

const flySpeed = 5;
const sprintSpeed = 20;

function frame() {
  if (Input.hasPointerLock) {
    Camera.mouseLookStep(Scene.current);
    Camera.cameraFlyStep(Scene.current, Input.pressed['shift'] ? sprintSpeed : flySpeed);
    Scene.current.updateViewMatrix();


    if (Input.pressed['e']) {
      Scene.current.setSunlightDirection(Scene.current.cameraPitch, Scene.current.cameraYaw);
    }
  }
}

(async function () {
  await Skybox.init();

  Scene.current.cameraPosition[1] = 15;
  Scene.current.cameraPosition[2] = 0;
  Scene.current.updateViewMatrix();

  const monkeyMesh = await GLTF.load("/assets/monkey.gltf")
  const monkeyObj = new RenderObject(monkeyMesh);
  monkeyObj.position = new Float32Array([5, 11, 5]);
  monkeyObj.updateModelMatrix();
  Scene.current.addRenderObject(monkeyObj);


  Scene.current.addDrawable(new Terrain("assets/heightmap2.png", "assets/grass.jpg", 200, 10));


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
