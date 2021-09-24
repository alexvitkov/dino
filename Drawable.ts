export default interface Drawable {
  shadowPass(mat: Float32Array): void;
  draw(view: Float32Array, proj: Float32Array, skybox: WebGLTexture, sundir: [number,number,number]): void;
}
