(async () => {
  const { createSession } = await import('./16a06d9fccef7819a504.mjs');

  const session = await createSession({
    locateFile: (path) => {
      if (path.endsWith('.wasm')) return './03bafc41e28c2f1e46f4.wasm';
      return path;
    }
  });

  window.removeBackground = async (buffer) => await session.remove(buffer);

  const removeBtn = document.getElementById("remove-btn");
  const downloadBtn = document.getElementById("download-btn");
  const result = document.getElementById("result");

  removeBtn.addEventListener("click", async () => {
    if (!window.fileData) return alert("먼저 이미지를 선택하세요.");
    removeBtn.disabled = true;
    removeBtn.textContent = "처리 중...";

    const buffer = await window.fileData.arrayBuffer();
    const resultBlob = new Blob([await window.removeBackground(buffer)], { type: "image/png" });
    const resultUrl = URL.createObjectURL(resultBlob);

    const tempImg = new Image();
    tempImg.src = resultUrl;
    tempImg.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = tempImg.naturalWidth;
      canvas.height = tempImg.naturalHeight;
      ctx.drawImage(tempImg, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const newImage = ctx.createImageData(canvas.width, canvas.height);
      const dst = newImage.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const isRed = r - g > 50 && r - b > 50 && r > 100;
        dst[i] = isRed ? 220 : r;
        dst[i + 1] = isRed ? 30 : g;
        dst[i + 2] = isRed ? 30 : b;
        dst[i + 3] = isRed ? 255 : 0;
      }

      ctx.putImageData(newImage, 0, 0);
      const transparentUrl = canvas.toDataURL("image/png");

      result.src = transparentUrl;
      result.style.display = "block";
      downloadBtn.style.display = "block";
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = transparentUrl;
        a.download = "background-removed.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      removeBtn.disabled = false;
      removeBtn.textContent = "배경 제거하기";
    };
  });
})();
