(async () => {
  const rembg = await (await import('./16a06d9fccef7819a504.mjs')).default({
    locateFile: (path) => {
      if (path.endsWith('.wasm')) return './03bafc41e28c2f1e46f4.wasm';
      return path;
    }
  });

  const ort = await import('./vendors-node_modules_onnxruntime-web_dist_ort_bundle_min_mjs.bundle.js');

  const session = await rembg.createSession(ort);
  window.removeBackground = async (buffer) => await session.remove(buffer);
})();
