
// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;
let video;

// Variables for displaying the results on the canvas
let label = "";
let confidence = "";

function preload() {
  classifier = ml5.imageClassifier("MobileNet");
  video = createVideo("images/elephant.mp4");
}

function setup() {
  createCanvas(400, 400);
  background(200);
  video.loop();
  video.size(400, 400);
  video.hide();
  classifier.classify(video, gotResult);
}

function draw() {
    image(video, 0, 0);
    fill(255);
    stroke(0);
    textSize(18);
    text(label, 10, 360);
    text(confidence, 10, 380);
}

function gotResult(results) {
    // The results are in an array ordered by confidence
    console.log(results);
  
    // Display the results on the canvas
    fill(255);
    stroke(0);
    textSize(18);
    label = "Label: " + results[0].label;
    confidence = "Confidence: " + nf(results[0].confidence, 0, 2);
    text(label, 10, 360);
    text(confidence, 10, 380);
  }