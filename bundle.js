(async () => {
  const rembg = await (await import('./16a06d9fccef7819a504.mjs')).default({
    locateFile: path => path.endsWith('.wasm')
      ? './03bafc41e28c2f1e46f4.wasm'
      : path
  });
  const session = await rembg.createSession();
  window.removeBackground = buffer => session.remove(buffer);
})().catch(console.error);

// 업로드된 파일을 전역 변수에 저장 (window.fileData)
{
  const input = document.getElementById('uploadInput');
  input.addEventListener('change', e => {
    if (e.target.files?.length) window.fileData = e.target.files[0];
  });
  const box = document.getElementById('upload-box');
  box.addEventListener('click', () => input.click());
  box.addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) window.fileData = e.dataTransfer.files[0];
  });
}

// 버튼 클릭 동작은 removeBackground 준비 이후 실행할 수 있도록 설정
const trySetup = () => {
  if (!window.removeBackground) {
    return setTimeout(trySetup, 100);
  }
  const btn = document.getElementById('remove-btn');
  btn.addEventListener('click', async () => {
    if (!window.fileData) return alert('먼저 이미지를 선택하세요.');
    btn.disabled = true;
    btn.textContent = '처리 중...';
    try {
      const buffer = await window.fileData.arrayBuffer();
      const output = await window.removeBackground(buffer);
      const blob = new Blob([output], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2];
          const isStrongRed = (r - g > 50 && r - b > 50 && r > 100);
          data[i+3] = isStrongRed ? 255 : 0;
        }
        ctx.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0);
        const transparentUrl = canvas.toDataURL('image/png');
        document.getElementById('result').src = transparentUrl;
        document.getElementById('result').style.display = 'block';
        const d = document.getElementById('download-btn');
        d.style.display = 'block';
        d.onclick = () => {
          const a = document.createElement('a');
          a.href = transparentUrl;
          a.download = 'background-removed.png';
          a.click();
        };
      };
    } catch (e) {
      console.error(e);
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      btn.disabled = false;
      btn.textContent = '배경 제거하기';
    }
  });
};
trySetup();
