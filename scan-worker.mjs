// Typical weight and visible fraction of a plate for each supported food.
const category = {
  'grilled chicken': ['chicken', 125, .23],
  'salmon fillet': ['salmon', 140, .25],
  'grilled steak': ['steak', 150, .26],
  'broccoli florets': ['broccoli', 100, .21],
  'cooked white rice': ['whiteRice', 145, .25],
  'cooked brown rice': ['rice', 145, .25],
  'cooked pasta': ['regularPasta', 160, .29],
  'boiled potatoes': ['potato', 150, .26],
  'french fries': ['fries', 120, .27],
  'carrot pieces': ['carrot', 85, .18],
  'cherry tomatoes': ['tomato', 75, .16],
  'cucumber': ['cucumber', 70, .18],
  'lettuce leaves': ['greens', 45, .22],
  'avocado': ['avocado', 75, .18],
  'chickpeas': ['chickpea', 110, .22],
  'cooked lentils': ['lentil', 120, .24],
  'green beans': ['greenBeans', 100, .24],
  'bell pepper slices': ['pepper', 75, .18],
  'red cabbage': ['redCabbage', 65, .20],
  'sweet potato': ['sweetPotato', 120, .22],
  'cooked zucchini slices': ['courgette', 90, .21],
  'cooked tofu cubes': ['tofu', 110, .22],
  'fried egg': ['friedEgg', 55, .17],
  'boiled egg': ['egg', 55, .15],
  'slice of toast': ['plainBread', 40, .20],
  'banana slices': ['banana', 100, .23],
  'apple slices': ['apple', 120, .25],
  'strawberries': ['strawberry', 90, .20],
  'blueberries': ['blueberry', 80, .18],
  'pizza': ['pizza', 260, .65, true],
  'hamburger': ['burger', 185, .35, true],
  'sushi rolls': ['sushi', 190, .35, true],
  'falafel balls': ['falafel', 125, .23, true],
  'hummus dip': ['hummus', 65, .20, true],
  'omelette': ['omelette', 150, .34, true],
  'bowl of soup': ['soup', 270, .55, true],
  'stack of pancakes': ['pancakes', 125, .36, true],
  'croissant': ['croissant', 60, .30, true],
  'spaghetti bolognese': ['bolognese', 290, .53, true],
  'ice cream scoops': ['icecream', 90, .22, true]
};

const plateLabel = 'dinner plate';
const queries = [...Object.keys(category), plateLabel];
const palettes = ['#306345','#8e4b32','#456286','#6c537c','#856019','#374e55','#843b54','#595b38'];
const clamp = (number, low, high) => Math.min(high, Math.max(low, number));
const area = box => Math.max(0, box.xmax - box.xmin) * Math.max(0, box.ymax - box.ymin);

function overlap(a, b) {
  return area({xmin: Math.max(a.xmin, b.xmin), ymin: Math.max(a.ymin, b.ymin),
    xmax: Math.min(a.xmax, b.xmax), ymax: Math.min(a.ymax, b.ymax)});
}

function normalizeBox({xmin, ymin, xmax, ymax}, width, height) {
  return {xmin:clamp(xmin / width, 0, 1), ymin:clamp(ymin / height, 0, 1),
    xmax:clamp(xmax / width, 0, 1), ymax:clamp(ymax / height, 0, 1)};
}

function buildSuggestions(results, width, height) {
  const detections = results.map(n => ({...n, box:normalizeBox(n.box, width, height)}))
    .filter(n => area(n.box) >= .012).sort((a,b) => b.score - a.score);
  const plate = detections.find(n => n.label === plateLabel && area(n.box) >= .22 && n.score >= .045)?.box;
  const candidates = detections.filter(n => Object.hasOwn(category, n.label));
  const minimumScore = Math.max(.035, (candidates[0]?.score ?? 0) * .38);
  const selected = [];

  for (const candidate of candidates) {
    if (candidate.score < minimumScore) break;
    if (plate && overlap(candidate.box, plate) / area(candidate.box) < .55) continue;
    const [id, weight, referenceArea, dish] = category[candidate.label];
    const candidateArea = area(candidate.box);
    const duplicate = selected.some(previous => {
      const shared = overlap(previous.box, candidate.box);
      const previousArea = area(previous.box);
      return shared / Math.min(previousArea, candidateArea) > .68 &&
        (previous.id === id || shared / Math.max(previousArea, candidateArea) > .54 ||
          (previous.dish && shared / candidateArea > .78) ||
          (dish && candidateArea > previousArea * 1.4 && shared / previousArea > .78));
    });
    if (!duplicate) selected.push({id, weight, referenceArea, dish, box:candidate.box});
  }

  const grouped = new Map();
  for (const item of selected) {
    const existing = grouped.get(item.id);
    if (existing) {
      if (existing.boxes.length < 3) existing.boxes.push(item.box);
    } else {
      grouped.set(item.id, {...item, boxes:[item.box]});
    }
  }

  return [...grouped.values()].slice(0, 8).map(({id, weight, referenceArea, boxes}, index) => {
    // A plate is a relative scale cue. A typical framing is used when the plate rim is unclear.
    const plateArea = plate ? area(plate) : .72;
    const fraction = boxes.reduce((sum, box) => sum + area(box), 0) / plateArea;
    const multiplier = clamp(Math.sqrt(fraction / referenceArea), .3, 2);
    const grams = Math.max(5, Math.round(weight * multiplier / 5) * 5);
    return {id, grams, boxes, number:index + 1, color:palettes[index]};
  });
}

let detectorPromise;
let queue = Promise.resolve();
let newest = 0;

function loadDetector() {
  detectorPromise ??= import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1')
    .then(async ({env, pipeline, RawImage}) => {
      env.allowLocalModels = false;
      env.backends.onnx.wasm.numThreads = 1;
      const detector = await pipeline('zero-shot-object-detection', 'Xenova/owlv2-base-patch16', {
        device:'wasm', dtype:'q8', revision:'7463883',
        progress_callback:info => {
          if (info.status !== 'progress' || !info.file?.endsWith('.onnx')) return;
          if (info.progress >= 100) self.postMessage({type:'inference', id:newest});
          else self.postMessage({type:'progress', id:newest, percent:Math.floor(info.progress)});
        }
      });
      return {detector, RawImage};
    }).catch(error => {
      detectorPromise = undefined;
      throw error;
    });
  return detectorPromise;
}

async function analyze({id, data, width, height}) {
  try {
    const {detector, RawImage} = await loadDetector();
    if (id !== newest) {
      self.postMessage({type:'result', id, matches:[]});
      return;
    }
    self.postMessage({type:'inference', id});
    const frame = new RawImage(data, width, height, 4);
    const results = await detector(frame, queries, {threshold:.02, top_k:100});
    self.postMessage({type:'result', id, matches:buildSuggestions(results, width, height)});
  } catch (error) {
    self.postMessage({type:'error', id, message:error?.message ?? String(error)});
  }
}

self.addEventListener('message', ({data}) => {
  newest = data.id;
  queue = queue.then(() => analyze(data));
});
