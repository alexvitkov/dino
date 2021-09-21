import { gl } from "./GL";


// Those interfaces describe a GLTF mesh
// The entries starting with an underscore are custom data
// that we write inside the JSON structs

interface GLTFJson {
  meshes: GLTFMesh[];
  buffers: GLTFBuffer[];
  bufferViews: GLTFBufferView[];
  accessors: GLTFAccessor[];
}

interface GLTFAccessor {
  bufferView: number;
  byteOffset?: number;
  componentType: number;
  normalized?: boolean;
  count: number;
  type: "SCALAR" | "VEC2" | "VEC3" | "VEC4" | "MAT2" | "MAT3" | "MAT4";
};

interface GLTFBuffer {
  uri: string;
  byteLength: number;
  _data: ArrayBuffer;
}

interface GLTFBufferView {
  buffer: number;
  byteOffset?: 0;
  byteLength: number;
  byteStride?: number;
}


interface GLTFMesh {
  primitives: GLTFPrimitive[];
}

interface GLTFPrimitive {
  attributes: {[key: string]: number };
  indices?: number;
}


export class Mesh {
  numIndices: number;
  vao: WebGLVertexArrayObject;
  positions: WebGLBuffer;
  normals: WebGLBuffer;
  indices: WebGLBuffer;

  draw() {
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
  }
};



function uploadBuffer(gltf: GLTFJson, location: number, accessor_index: number): WebGLBuffer {
  const glBuffer = gl.createBuffer();
  gl.bindBuffer(location, glBuffer);

  const accessor = gltf.accessors[accessor_index];
  const bufferView = gltf.bufferViews[accessor.bufferView];

  const data = gltf.buffers[bufferView.buffer]._data;

  let offset = 0;
  if (bufferView.byteOffset)
    offset += bufferView.byteOffset;
  if (accessor.byteOffset)
    offset += accessor.byteOffset;
    
  const arr = new Uint8Array(data, offset, bufferView.byteLength);
  gl.bufferData(location, arr, gl.STATIC_DRAW);

  return glBuffer;
}


function uploadAttibuteBuffer(gltf: GLTFJson, location: number, bindpoint: number, accessor_index: number): WebGLBuffer {
  const accessor = gltf.accessors[accessor_index];
  const bufferView = gltf.bufferViews[accessor.bufferView];

  if (bufferView.byteStride !== undefined)
    throw 'buffer views with stride not implemented';

  const glBuffer = uploadBuffer(gltf, location, accessor_index);

  let itemCount: number;
  switch (accessor.type) {
    case "SCALAR": itemCount = 1; break;
    case "VEC2":   itemCount = 2; break;
    case "VEC3":   itemCount = 3; break;
    case "VEC4":   itemCount = 4; break;
    default: throw 'unsupported type';
  }

  let normalized = false;
  if (accessor.normalized)
    normalized = true;

  gl.enableVertexAttribArray(bindpoint);
  gl.vertexAttribPointer(bindpoint, itemCount, accessor.componentType, normalized, 0, 0);

  return glBuffer;
}


function loadPrimitive(gltf: GLTFJson, primitive: GLTFPrimitive): Mesh {
  const mesh = new Mesh();
  mesh.vao = gl.createVertexArray();
  gl.bindVertexArray(mesh.vao);

  mesh.positions = uploadAttibuteBuffer(gltf, gl.ARRAY_BUFFER, 0, primitive.attributes.POSITION);
  mesh.normals = uploadAttibuteBuffer(gltf, gl.ARRAY_BUFFER, 1, primitive.attributes.NORMAL);
  mesh.indices = uploadBuffer(gltf, gl.ELEMENT_ARRAY_BUFFER, primitive.indices);

  mesh.numIndices = gltf.accessors[primitive.indices].count;

  gl.bindVertexArray(null);
  return mesh;
}


export async function load(path: string): Promise<Mesh> {

  const basedir = path.substring(0,path.lastIndexOf("/")+1);

  const result = await fetch(path);
  const gltf: GLTFJson = await result.json();

  // load the buffers
  await Promise.all(gltf.buffers.map(async (buf: GLTFBuffer) => {
    const resp = await fetch(basedir + buf.uri);
    buf._data = await resp.arrayBuffer();
  }));

  return loadPrimitive(gltf, gltf.meshes[0].primitives[0]);
}
