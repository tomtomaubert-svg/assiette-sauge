let worker;
let sequence = 0;
const requests = new Map();

function getWorker() {
  if (worker) return worker;
  const next = new Worker(new URL('./scan-worker.mjs?v=9', import.meta.url), {type:'module'});
  next.addEventListener('message', ({data}) => {
    const request = requests.get(data.id);
    if (!request) return;
    if (data.type === 'progress') request.onProgress(data.percent);
    if (data.type === 'inference') request.onInference();
    if (data.type === 'result' || data.type === 'error') {
      requests.delete(data.id);
      if (data.type === 'result') request.resolve(data.matches);
      else request.reject(new Error(data.message));
    }
  });
  next.addEventListener('error', event => {
    if (worker !== next) return;
    for (const request of requests.values()) request.reject(new Error(event.message || 'Le modèle ne peut pas démarrer.'));
    requests.clear();
    next.terminate();
    worker = undefined;
  });
  worker = next;
  return worker;
}

export function detectMeal(image, {onProgress, onInference, isCurrent}) {
  const ratio = Math.min(1, 768 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const {data, width, height} = context.getImageData(0, 0, canvas.width, canvas.height);
  if (!isCurrent()) return Promise.resolve([]);
  const active = getWorker();
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    requests.set(id, {onProgress, onInference, resolve, reject});
    try {
      active.postMessage({id, data, width, height}, [data.buffer]);
    } catch (error) {
      requests.delete(id);
      reject(error);
    }
  });
}
