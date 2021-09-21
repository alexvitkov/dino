import * as GLTF from "./GLTF";
import * as Input from "./Input";
import * as Camera from "./Camera";
import * as MainLoop from "./MainLoop";
import RenderObject from "./RenderObject";
import Scene from "./Scene";
import Skybox from "./Skybox";
import Terrain from "./Terrain";


function frame() {
  if (Input.hasPointerLock) {
    Camera.mouseLookStep(Scene.current);
    Camera.cameraFlyStep(Scene.current);
    Scene.current.updateViewMatrix();
  }
}

(async function () {
  await Skybox.init();


  Scene.current.cameraPosition[1] = 10;
  Scene.current.cameraPosition[2] = 0;
  Scene.current.updateViewMatrix();

  // const monkeyMesh = await GLTF.load("/assets/cube.gltf")
  // const monkeyObj = new RenderObject(monkeyMesh);
  // monkeyObj.position = new Float32Array([0, 0, 0]);
  // monkeyObj.updateModelMatrix();
  // Scene.current.addRenderObject(monkeyObj);


  Scene.current.addDrawable(new Terrain("assets/heightmap.png", "assets/grass.jpg", 200, 20));


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
