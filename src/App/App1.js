import React from "react";
import Sketch from "react-p5";

let x = 50;
let cnv = null;
let angle = 0;
let aaa = '';


export default (props) => {
	const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		cnv = p5.createCanvas(props.x, props.y, p5.WEBGL).parent(canvasParentRef)
	};

	const draw = (p5) => {
		cnv.background(200);
		p5.fill(0);
		p5.rotateX(angle);
		p5.rotateY(angle * 0.3);
		p5.rotateZ(angle * 1.2);
		//p5.ellipse(x, y, 5, 5);
		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes
		p5.noStroke();
		p5.normalMaterial();
		p5.torus(100, 10);
		angle += 0.01;
		if (x < 200) {
			x++;
		} else {
			x = 0;
		}
	};

	return (
		<Sketch setup={setup} draw={draw} />
	);
};