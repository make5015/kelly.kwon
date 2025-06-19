import initRembg from './16a06d9fccef7819a504.mjs';
import * as ort from './vendors-node_modules_onnxruntime-web_dist_esm_ort.mjs';
import wasmFactory from './03bafc41e28c2f1e46f4.wasm';

let session = null;

async function loadModel() {
  const rembg = await initRembg({
    locateFile(path) {
      if (path.endsWith('.wasm')) {
        return './03bafc41e28c2f1e46f4.wasm';
      }
      return path;
    },
  });
  session = await rembg.createSession(ort);
}

async function removeBackground(buffer) {
  if (!session) {
    await loadModel();
  }
  return await session.remove(buffer);
}

// ✅ 전역 등록
window.removeBackground = removeBackground;
