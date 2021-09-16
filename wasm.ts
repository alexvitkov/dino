

const exportsToWasm = {
  alert: alert
};

var wasmExports;

export async function init() {
  const wasm = await WebAssembly.instantiateStreaming(fetch('main.wasm'), {
    'env': exportsToWasm
  });

  wasmExports = wasm.instance.exports;
}
