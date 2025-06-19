(async () => {
  const rembg = await (await import('./16a06d9fccef7819a504.mjs')).default({
    locateFile: (path) => {
      if (path.endsWith('.wasm')) return './03bafc41e28c2f1e46f4.wasm';
      return path;
    }
  });

  const session = await rembg.createSession();
  window.removeBackground = async (buffer) => await session.remove(buffer);
})();
