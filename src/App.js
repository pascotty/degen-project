import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from '@tensorflow/tfjs'; 

import Webcam from "react-webcam";

import UploadAndDisplayImage from "./UploadAndDisplayImage"

function App() {

  //Create own model using e6 data...

  


  //CocoSSD, should load model we choose -> still confusing

  const [model, setModel] = useState();

  async function loadModel() {
    try {
      const model = await cocoSsd.load();
      setModel(model);
      console.log("set loaded model");
    } 
    catch (err) {
      console.log(err);
      console.log("failed load model");
    }
  }
  useEffect(() => { tf.ready().then(() => { loadModel(); }); }, []);
  //Below we load image and predict

  const [videoWidth, setVideoWidth] = useState(960);
  const [videoHeight, setVideoHeight] = useState(640);
  async function predictionFunction() {
    //Clear the canvas for each prediction
    var cnvs = document.getElementById("myCanvas");
    var context = cnvs.getContext("2d");
    context.clearRect(0,0,cnvs.width,cnvs.height);
    //Start prediction

    const predictions = await model.detect(document.getElementById("img"));

    
    if (predictions.length > 0) {
      console.log(predictions);
      for (let n = 0; n < predictions.length; n++) {
        console.log(n);
        if (predictions[n].score >= 0.1) {
          //Threshold is 0.1 or 10%
          //Extracting the coordinate and the bounding box information
          let bboxLeft = predictions[n].bbox[0];
          let bboxTop = predictions[n].bbox[1];
          let bboxWidth = predictions[n].bbox[2];
          let bboxHeight = predictions[n].bbox[3] - bboxTop;
          console.log("bboxLeft: " + bboxLeft);
          console.log("bboxTop: " + bboxTop);
          console.log("bboxWidth: " + bboxWidth);
          console.log("bboxHeight: " + bboxHeight);
          //Drawing begin
          context.beginPath();
          context.font = "12px Arial";
          context.fillStyle = "red";
          context.fillText(
          predictions[n].class +": " + Math.round(parseFloat(predictions[n].score) * 100) + "%", bboxLeft,bboxTop+95);
          context.rect(bboxLeft, bboxTop+100, bboxWidth, bboxHeight);
          context.strokeStyle = "#FF0000";
          context.lineWidth = 3;
          context.stroke();
          console.log("detected");
        }
      }
    }
    //Rerun prediction by timeout
    //setTimeout(() => predictionFunction(), 500);
  }


  //Below is the web interface, should have a place to UPLOAD an image, then predict on that image, draw what it is
  return (

    <div className="App">


      <div style={{position: "absolute", top: "50px"}}>
        <UploadAndDisplayImage id="img" />
      </div>
      <div style={{position: "absolute", top: "50px", pointerEvents:"none", zIndex: "15"}}>
        <canvas id="myCanvas" width={videoWidth} height={videoHeight} style={{backgroundColor: "transparent" }} />
      </div>

      <button variant={"contained"} style={{ color: "white",backgroundColor: "blueviolet",width: "50%",maxWidth: "250px", top: "100px"}} onClick={() => { predictionFunction(); }}>
        Start Detect
      </button>



    </div>
  );
}

export default App;
