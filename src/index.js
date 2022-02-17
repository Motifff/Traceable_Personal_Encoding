import React from 'react';
import ReactDOM from 'react-dom';
import {Editor1} from './Editor/Editor1';
import './Style1.css'

ReactDOM.render(
  <body>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100&display=swap" rel="stylesheet"></link>
    <Editor1 />
  </body>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
