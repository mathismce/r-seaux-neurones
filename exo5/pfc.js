/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

let handPose;
let video;
let hands = [];
let state = "dPierre";
let temps = 200;
let classifier;

function preload() {
    // Load the handPose model
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(640, 480);
    // Create the webcam video and hide it
    video = createCapture(VIDEO, { flipped: true });
    video.size(640, 480);
    video.hide();
    // start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);

    let options = {
        task: "classification",
        debug: true,
    };
    classifier = ml5.neuralNetwork(options);
}

function draw() {
    // Draw the webcam video
    image(video, 0, 0, width, height);

    // Draw all the tracked hand points
    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        let sumX = 0;
        let sumY = 0;
        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            fill(0, 255, 0);
            noStroke();
            circle(width - keypoint.x, keypoint.y, 10);

            sumX += keypoint.x;
            sumY += keypoint.y;
        }

        // Calculate the average position
        let avgX = sumX / hand.keypoints.length;
        let avgY = sumY / hand.keypoints.length;

        // Draw a red point at the average position
        fill(255, 0, 0);
        noStroke();
        circle(width - avgX, avgY, 20);
    }

    fill(255);
    textSize(32);
    text(state, 10, 50)
    text(temps, 10, 100);

    if (state === "dPierre" && temps > 0) {
        temps--;
    } else if (state === "dPierre" && temps <= 0) {
        state = "Pierre";
        temps = 500;
    } else if (state === "Pierre" && temps > 0) {
        temps--;
        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            let sumX = 0;
            let sumY = 0;

            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                sumX += keypoint.x;
                sumY += keypoint.y;
            }

            let inputs = [];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                inputs.push(keypoint.x - sumX / hand.keypoints.length);
                inputs.push(keypoint.y - sumY / hand.keypoints.length);
            }
            classifier.addData(inputs, ["Pierre"]);
            console.log("Adding to Pierre");
        }
    } else if (state === "Pierre" && temps <= 0) {
        state = "dFeuille";
        temps = 500;
    } else if (state === "dFeuille" && temps > 0) {
        temps--;
    } else if (state === "dFeuille" && temps <= 0) {
        state = "Feuille";
        temps = 500;
    } else if (state === "Feuille" && temps > 0) {
        temps--;
        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            let sumX = 0;
            let sumY = 0;

            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                sumX += keypoint.x;
                sumY += keypoint.y;
            }

            let inputs = [];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                inputs.push(keypoint.x - sumX / hand.keypoints.length);
                inputs.push(keypoint.y - sumY / hand.keypoints.length);
            }
            classifier.addData(inputs, ["Feuille"]);
            console.log("Adding to Feuille");
        }
    } else if (state === "Feuille" && temps <= 0) {
        state = "dCiseaux";
        temps = 500;
    } else if (state === "dCiseaux" && temps > 0) {
        temps--;
    } else if (state === "dCiseaux" && temps <= 0) {
        state = "Ciseaux";
        temps = 500;
    } else if (state === "Ciseaux" && temps > 0) {
        temps--;
        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            let sumX = 0;
            let sumY = 0;

            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                sumX += keypoint.x;
                sumY += keypoint.y;
            }

            let inputs = [];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                inputs.push(keypoint.x - sumX / hand.keypoints.length);
                inputs.push(keypoint.y - sumY / hand.keypoints.length);
            }
            classifier.addData(inputs, ["Ciseaux"]);
            console.log("Adding to Ciseaux");
        }
    }
    else if ((state == "Ciseaux") && (temps <= 0)) {
        state = "Entrainement";
        console.log("Training complete!");
        temps = "";
        classifier.normalizeData();
        classifier.train({ epochs: 200 }, finishedTraining);
    }
    else if (state == "Entrainement terminé") {
        let inputs = [];
        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                inputs.push(keypoint.x - sumX / hand.keypoints.length);
                inputs.push(keypoint.y - sumY / hand.keypoints.length);
            }
            classifier.classify(inputs, gotResults);
        }

    }

}

    // Callback function for when handPose outputs data
    function gotHands(results) {
        // save the output to the hands variable
        hands = results;
    }

    function finishedTraining() {
        state = "Entrainement terminé";
    }

    function gotResults(results) {
        temps = results[0].label + " (" + results[0].confidence + ")";
    }