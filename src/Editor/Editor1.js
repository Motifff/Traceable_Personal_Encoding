import React, { useContext, useEffect, useState } from "react";
import App1 from "../App/App1";
import App2 from "../App/App2";
import {App3,playerName} from "../App/App3";
import '../Style1.css'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export const Editor1 = (props) =>{
  const { width, height } = useWindowDimensions();
  const indata = useContext(playerName);
  return (
    <div>
      <div className="Hover">
        <App3 x={0.29*width} y={height} name={indata.string} num={indata.touchTime}/>
      </div>
      <div className='strictBox'>
        <div className= 'verticalBox'>
          <App1 x={0.29*width} y={height}/>
        </div>
        <div className='verticalBox'>
          <App2 x={0.69*width} y={height}/>
        </div>
      </div>
    </div>
    );
};