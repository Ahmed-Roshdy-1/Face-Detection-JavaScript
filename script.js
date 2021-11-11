let video; // webcam input
let model; // BlazeFace machine-learning model
let face; // detected face

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.hide();

  loadFaceModel();
}

// TensorFlow requires the loading of the model
async function loadFaceModel() {
  model = await blazeface.load();
}

function draw() {
  // if the video is active and the model has
  // been loaded, get the face from this frame
  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }
  // if we have face data, display it
  if (face !== undefined) {
    // console.log(face);
    // noLoop();
    image(video, 0, 0, width, height);
    let rightEye = face.landmarks[0];
    let leftEye = face.landmarks[1];
    let nose = face.landmarks[2];
    let rightEar = face.landmarks[3];
    let leftEar = face.landmarks[4];

    rightEye = scalePoint(rightEye);
    leftEye = scalePoint(leftEye);
    nose = scalePoint(nose);

    // fun
    // stuff with those points!
    fill(255);
    noStroke();
    circle(leftEye.x, leftEye.y, 45); // eyeball
    circle(rightEye.x, rightEye.y, 45);
    fill(0);
    circle(leftEye.x, leftEye.y, 15); // pupil
    circle(rightEye.x, rightEye.y, 15);
    fill(220);
    circle(leftEye.x + 2, leftEye.y - 2, 5); // reflection
    circle(rightEye.x + 2, rightEye.y - 2, 5);
  }
}

function scalePoint(pt) {
  let x = map(pt[0], 0, video.width, 0, width);
  let y = map(pt[1], 0, video.height, 0, height);
  return createVector(x, y);
}

// geting face data
async function getFace() {
  const prediction = await model.estimateFaces(document.querySelector("video"), false);
  // if we there were no predictions, set
  // the face to undefined
  if (prediction.length === 0) {
    face = undefined;
  } else {
    // otherwise, grab the first face
    face = prediction[0];
  }
}
