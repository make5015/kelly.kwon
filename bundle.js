(async () => {
  const rembgModule = await import('./16a06d9fccef7819a504.mjs');
  const rembg = rembgModule.default || rembgModule;

  const session = await rembg({
    locateFile: (path) => {
      if (path.endsWith('.wasm')) return './03bafc41e28c2f1e46f4.wasm';
      return path;
    }
  }).createSession();

  window.removeBackground = async (buffer) => await session.remove(buffer);
})();
