export function normalize(angle: number): number {
  while (angle > Math.PI)
    angle -= Math.PI * 2;
  while (angle < -Math.PI)
    angle += Math.PI * 2;
  return angle;
}
