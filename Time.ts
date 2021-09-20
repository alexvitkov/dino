export var time: number = performance.now();
export var currentFrame = 0;
export var deltaTime = 1/30;

var lastTime = time;


export function onNewFrame() {
  time = performance.now();
  deltaTime = (time - lastTime) / 1000;
  lastTime = time;
  currentFrame++;
}
