(async () => {
  const rembg = await (await import('./16a06d9fccef7819a504.mjs')).default({
    locateFile: (path) => {
      if (path.endsWith('.wasm')) return './03bafc41e28c2f1e46f4.wasm';
      return path;
    },
  });

  const session = await rembg.createSession();
  window.removeBackground = async (buffer) => await session.remove(buffer);

  const removeBtn = document.getElementById("remove-btn");
  const result = document.getElementById("result");
  const downloadBtn = document.getElementById("download-btn");

  removeBtn.addEventListener("click", async () => {
    if (!window.fileData) return alert("이미지를 먼저 업로드해주세요.");
    removeBtn.disabled = true;
    removeBtn.textContent = "처리 중...";

    const buffer = await window.fileData.arrayBuffer();
    const output = await window.removeBackground(buffer);
    const blob = new Blob([output], { type: "image/png" });
    const url = URL.createObjectURL(blob);

    result.src = url;
    result.style.display = "block";

    downloadBtn.style.display = "block";
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "background-removed.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    removeBtn.disabled = false;
    removeBtn.textContent = "배경 제거하기";
  });
})();
