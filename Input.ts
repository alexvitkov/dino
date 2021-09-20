import { canvas } from "./GL";

export const pressed: {[key: string]: boolean} = {};
export var hasPointerLock = false;

export var mouseX = 0;
export var mouseY = 0;

interface Axis {
  value(): number;
};

class TwoKeyAxis implements Axis {
  constructor(public negativeKey: string, public positiveKey: string) {}

  value(): number {
    let val = 0.0;

    if (pressed[this.negativeKey])
      val -= 1.0;

    if (pressed[this.positiveKey])
      val += 1.0;

    return val;
  }
};

class MouseAxis implements Axis {
  delta = 0;

  constructor() {}

  value(): number {
    return this.delta;
  }
}

export const axes = {
  horizontal: new TwoKeyAxis('a', 'd'),
  vertical: new TwoKeyAxis('s', 'w'),
  mouseX: new MouseAxis(),
  mouseY: new MouseAxis(),
}


//
// Initialize the Input system
//
document.onkeydown = function (e: KeyboardEvent) {
  pressed[e.key] = true;
}

document.onkeyup = function (e: KeyboardEvent) {
  pressed[e.key] = false;
}

document.onmousemove = function (e: MouseEvent) {
  const r = canvas.getBoundingClientRect();
  mouseX =  2 * (e.clientX - r.x) / canvas.width  - 1;
  mouseY = -2 * (e.clientY - r.y) / canvas.height + 1;

  axes.mouseX.delta += e.movementX / canvas.width;
  axes.mouseY.delta += e.movementY / canvas.height;
}

canvas.onmousedown = (e) => {
  if (e.which === 1) {
    canvas.requestPointerLock();
  }
}

document.onpointerlockchange = () => {
  hasPointerLock = document.pointerLockElement === canvas;
}
