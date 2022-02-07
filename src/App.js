import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from '@tensorflow/tfjs'; 

function App() {
  //Put CNN CODE HERE

  const [model, setModel] = useState();

  async function loadModel() {
    try {
      const model = await cocoSsd.load();
      setModel(model);
      console.log("set loaded Model");
    } 
    catch (err) {
      console.log(err);
      console.log("failed load model");
    }
  }
  useEffect(() => { tf.ready().then(() => { loadModel(); }); }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
