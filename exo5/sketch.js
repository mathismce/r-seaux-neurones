/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates drawing skeletons on poses for the MoveNet model.
 */

let video;
let bodyPose;
let poses = [];
let connections;
let balls = [];
let frameCounter = 0; // Counter to control ball appearance frequency
let ballFrequency = 1;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeletal connection information
  connections = bodyPose.getConnections();
}

function draw() {

  translate(width, 0);
  scale(-1, 1);
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw the skeleton connections
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      // Only draw a line if both points are confident enough
      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(255, 0, 0);
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }

  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is bigger than 0.1
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
      let rightWrist = pose.keypoints.find(point => point.name === 'right_wrist');
      let rightElbow = pose.keypoints.find(point => point.name === 'right_elbow');
      if (rightWrist && rightWrist.confidence > 0.1 && rightElbow && rightElbow.confidence > 0.1) {
        if (frameCounter % ballFrequency === 0) {
          // Calculate the direction vector from the wrist to the elbow
          let directionX = rightWrist.x - rightElbow.x;
          let directionY = rightWrist.y - rightElbow.y; 
          let magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
          let vx = (directionX / magnitude) * 5; 
          let vy = (directionY / magnitude) * 5;
          balls.push({ x: rightWrist.x, y: rightWrist.y, vx: vx, vy: vy });
        }
      }
    }

    // Update and draw the balls
    for (let i = balls.length - 1; i >= 0; i--) {
      let ball = balls[i];
      console.log(ball);

      ball.x += ball.vx;
      ball.y += ball.vy;
      fill(random(255), random(255), random(255));
      noStroke();
      circle(ball.x, ball.y, 10);

      // Remove the ball if it goes off screen
      if (ball.x < 0 || ball.x > width || ball.y < 0 || ball.y > height) {
        balls.splice(i, 1);
      }
    }
  }

}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}
