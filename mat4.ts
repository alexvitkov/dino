
export function make(): Float32Array {
  return new Float32Array(16);
}

export function identity(mat: Float32Array) {
  mat[0] = 1;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;

  mat[4] = 0;
  mat[5] = 1;
  mat[6] = 0;
  mat[7] = 0;

  mat[8] = 0;
  mat[9] = 0;
  mat[10] = 1;
  mat[11] = 0;

  mat[12] = 0;
  mat[13] = 0;
  mat[14] = 0;
  mat[15] = 1;
}

export function rotate_x(mat: Float32Array, angle: number) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  const a10 = mat[1];
  const a20 = mat[2];
  const a11 = mat[5];
  const a21 = mat[6];
  const a12 = mat[9];
  const a22 = mat[10];
  const a13 = mat[13];
  const a23 = mat[14];

  mat[1] = c*a10 + s*a20;
  mat[2] = -s*a10 + c*a20;
  mat[5] = c*a11 + s*a21;
  mat[6] = -s*a11 + c*a21;
  mat[9] = c*a12 + s*a22;
  mat[10] = -s*a12 + c*a22;
  mat[13] = c*a13 + s*a23;
  mat[14] = -s*a13 + c*a23;
}

export function rotate_y(mat: Float32Array, angle: number) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  const a00 = mat[0];
  const a20 = mat[2];
  const a01 = mat[4];
  const a21 = mat[6];
  const a02 = mat[8];
  const a22 = mat[10];
  const a03 = mat[12];
  const a23 = mat[14];

  mat[0] = c*a00 + s*a20;
  mat[2] = -s*a00 + c*a20;
  mat[4] = c*a01 + s*a21;
  mat[6] = -s*a01 + c*a21;
  mat[8] = c*a02 + s*a22;
  mat[10] = -s*a02 + c*a22;
  mat[12] = c*a03 + s*a23;
  mat[14] = -s*a03 + c*a23;
}

export function rotate_z(mat: Float32Array, angle: number) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  const a00 = mat[0];
  const a10 = mat[1];
  const a01 = mat[4];
  const a11 = mat[5];
  const a02 = mat[8];
  const a12 = mat[9];
  const a03 = mat[12];
  const a13 = mat[13];

  mat[0] = c*a00 + s*a10;
  mat[1] = -s*a00 + c*a10;
  mat[4] = c*a01 + s*a11;
  mat[5] = -s*a01 + c*a11;
  mat[8] = c*a02 + s*a12;
  mat[9] = -s*a02 + c*a12;
  mat[12] = c*a03 + s*a13;
  mat[13] = -s*a03 + c*a13;
}


export function translate(mat: Float32Array, v: Float32Array) {
  let x = v[0];
  let y = v[1];
  let z = v[2];

  mat[12] = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12];
  mat[13] = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13];
  mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
  mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];

  return mat;
}

export function perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
  const f = 1.0 / Math.tan(fovy / 2);

  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  const nf = 1 / (near - far);
  out[10] = (far + near) * nf;
  out[14] = 2 * far * near * nf;
}
