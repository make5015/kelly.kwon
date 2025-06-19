(async () => {
  const rembg = await (await import('./16a06d9fccef7819a504.mjs')).default({
    locateFile: (path) => {
      if (path.endsWith('.wasm')) return './03bafc41e28c2f1e46f4.wasm';
      return path;
    },
  });

  const session = await rembg.createSession();
  window.removeBackground = async (buffer) => await session.remove(buffer);

  // ✅ removeBackground 준비가 끝난 후 버튼 이벤트 등록
  const removeBtn = document.getElementById("remove-btn");
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
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const isStrongRed = (r - g > 50) && (r - b > 50) && r > 100;
        if (isStrongRed) {
          data[i] = 220;
          data[i + 1] = 30;
          data[i + 2] = 30;
          data[i + 3] = 255;
        } else {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const transparentUrl = canvas.toDataURL("image/png");

      const result = document.getElementById("result");
      const downloadBtn = document.getElementById("download-btn");
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
