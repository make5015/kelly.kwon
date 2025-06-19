
import initWasm from './16a06d9fccef7819a504.mjs';
import onnxruntime from './vendors-node_modules_onnxruntime-web_dist_index_browser_esm_js.mjs';

async function removeBackgroundFromImage(buffer) {
  await initWasm();
  // 초기화 및 세션 생성 코드
  // 예: const session = await onnxruntime.InferenceSession.create(...);
  // buffer → Tensor 변환 → 실행 → output → 이미지 반환
  console.log("Background removal logic goes here.");
}

window.removeBackground = removeBackgroundFromImage;
