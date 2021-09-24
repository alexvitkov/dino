export default interface Drawable {
  shadowPass(mat: Float32Array): void;
  draw(viewproj: Float32Array, skybox: WebGLTexture, sundir: [number,number,number]): void;
}
