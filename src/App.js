import './App.css';
import React, { useEffect, useState, useRef } from "react";

import * as tf from '@tensorflow/tfjs'; 
import Papa from "papaparse"
import FileSaver from 'file-saver'
import JSZip from "jszip"

import UploadAndDisplayImage from "./UploadAndDisplayImage"
import DataFaces from "./data/faces_q.csv"
import TestFaces from "./data/test.csv"
function App() {
  
  var [model, setModel] = useState();
  const [videoWidth, setVideoWidth] = useState(960);
  const [videoHeight, setVideoHeight] = useState(640);
  //const JSZip = require('jszip')();
  var zip = new JSZip();

  const csvUrl = "https://raw.githubusercontent.com/arfafax/E621-Face-Dataset/master/faces_q.csv";

  var csvData;
  async function getCSVData(){
    Papa.parse(csvUrl, {
      download: true,
      complete: async function(results) {
        csvData = (await results);
        formatToTextFiles();
      }
    });
  }
  


  async function formatToTextFiles(){
    for(let i = 1; i <= 10; i++)//csvData.data.length; i++)
    {
      console.log(csvData.data[i][16] + " " + 
      ((parseFloat(csvData.data[i][6]) + parseFloat(csvData.data[i][4])) / 2).toString() + " " +
      ((parseFloat(csvData.data[i][7]) + parseFloat(csvData.data[i][5])) / 2).toString() + " " + 
      (parseFloat(csvData.data[i][6]) - parseFloat(csvData.data[i][4])).toString() + " " + 
      (parseFloat(csvData.data[i][7]) - parseFloat(csvData.data[i][5])).toString());
    
      //in the format of <object-class> <x_center> <y_center> <width> <height>
      zip.file(csvData.data[i][0] + ".txt", csvData.data[i][16] + " " + 
      ((parseFloat(csvData.data[i][6]) + parseFloat(csvData.data[i][4])) / 2).toString() + " " +
      ((parseFloat(csvData.data[i][7]) + parseFloat(csvData.data[i][5])) / 2).toString() + " " + 
      (parseFloat(csvData.data[i][6]) - parseFloat(csvData.data[i][4])).toString() + " " + 
      (parseFloat(csvData.data[i][7]) - parseFloat(csvData.data[i][5])).toString());
    }


  }
  async function downloadParsedData(){
    zip.generateAsync({type: "blob"}).then(content => {
      FileSaver.saveAs(content, "testData.zip");
      //console.log("TEST")
    });
  }


/* TENSORFLOW ATEMPT at CNN, need training images to be tensors

  async function loadData(){
    const csvUrl = "https://raw.githubusercontent.com/arfafax/E621-Face-Dataset/master/faces_q.csv";
    const trainingData = tf.data.csv(TestFaces,{columnConfigs: {species:{isLabel: true}}});
    const numOfFeatures = (await trainingData.columnNames()).length - 1; //# of species = # of classifiers

    //After reading in numOfFeatures, take the last col (species), count # of UNIQUE species, make that the input Shape if possible??
    console.log((await trainingData.columnNames())[16]);

    const numOfSamples = 10; //test #, will change later
    const convertedData = trainingData.map(({xs, ys}) => {
                      const labels = [
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0, //just testing, need to make this unique per species... 
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                            ys.species == (trainingData.columnNames())[16] ? 1 : 0,
                      ]           
                      return{ xs: Object.values(xs), ys: Object.values(labels)};
    }).batch(1);

    model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [numOfFeatures], activation: "relu", units: 5})) //activation can be sigmoid <- more accurate/tradeoff
    //model.add(tf.layers.dense({activation: "softmax", units: 8}))
    //model.add(tf.layers.dense({activation: "relu", units: 5}))
    model.add(tf.layers.dense({activation: "sigmoid", units: 14}));

    model.compile({loss: "categoricalCrossentropy", optimizer: tf.train.adam(0.06)});
    await model.fitDataset(convertedData, 
    { 

      epochs:100,
      callbacks:{
        onEpochEnd: async(epoch, logs) =>{
          console.log("Epoch: " + epoch + " Loss: " + parseFloat(logs.loss));
        }
      } 
    });

    const testVal = tf.tensor2d([4.4, 2.9, 1.4, 0.2], [1, 4]);

  }
  loadData();
*/
  //Below we load image and predict

  async function predictionFunction() {
    //Clear the canvas for each prediction
    var cnvs = document.getElementById("myCanvas");
    var context = cnvs.getContext("2d");
    context.clearRect(0,0,cnvs.width,cnvs.height);
    //Start prediction
    console.log(document.getElementById("img"));
    //const predictions = await model.detect(document.getElementById("img"));

    const predictions = await model.predict((document.getElementById("img")), [1]); //might work too

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
      <button variant={"contained"} style={{ color: "white",backgroundColor: "green",width: "50%",maxWidth: "250px", top: "100px"}} onClick={() => {   getCSVData(); }}>
        Parse Data (Temp)
      </button>
      <button variant={"contained"} style={{ color: "white",backgroundColor: "red",width: "50%",maxWidth: "250px", top: "100px"}} onClick={() => {   downloadParsedData(); }}>
        Download Data (Temp)
      </button>


    </div>
  );
}

export default App;
