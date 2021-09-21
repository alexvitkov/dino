export default interface Drawable {
  draw(view, proj, skybox: WebGLTexture): void;
}
