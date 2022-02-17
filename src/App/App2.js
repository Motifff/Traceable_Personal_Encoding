import React, { useContext } from "react";
import Sketch from "react-p5";
import vert from "./assets/shader.vert"
import frag from "./assets/shader.frag"
import thechess from "./assets/ChessSet.obj"
import { playerName } from './App3'

let cnv1 = null;
let cnv2 = null;
let theShader = null;

let chessModel = null;

let ctl = null;

let orig = 0;

let darkMark = 0;

export default (props) => {
    const input = useContext(playerName);
    const preload = (p5) => {
        // a shader is composed of two parts, a vertex shader, and a fragment shader
        // the vertex shader prepares the vertices and geometry to be drawn
        // the fragment shader renders the actual pixel colors
        // loadShader() is asynchronous so it needs to be in preload
        // loadShader() first takes the filename of a vertex shader, and then a frag shader
        // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
        chessModel = p5.loadModel(thechess);
        theShader = p5.loadShader(vert, frag);
    }

    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        cnv1 = p5.createCanvas(props.x, props.y, p5.WEBGL).parent(canvasParentRef)
        p5.noStroke();
        p5.frameRate(30);
        //theShader = p5.createShader(vs,fs);
        ctl = new chessController(p5);
        for (let i = 0; i < 100; i++) {
            ctl.initOne(p5);
        }
        darkMark = p5.int(ctl.Dark.length / 2);
        p5.textFont("Noto Sans SC");
    };

    const draw = (p5) => {
        p5.ambientLight(200);
        cnv1.background(0);
        // shader() sets the active shader with our shader
        p5.rotateX(p5.PI / 5);
        // Send the frameCount to the shader
        theShader.setUniform("uFrameCount", p5.frameCount);
        // Rotate our geometry on the X and Y axes
        ctl.nameIt(p5);
        ctl.update(p5, props);
        if (input.touchTime !== orig) {
            ctl.setOneLight(p5);
            orig = input.touchTime;
        } else {
        }
        if (ctl.Dark.length <= darkMark) {
            for (let i = 0; i < darkMark / 2; i++) {
                ctl.addOneDark(p5);
            }
            darkMark = p5.int(darkMark / 2);
        }
    };

    return <Sketch preload={preload} setup={setup} draw={draw} />;
};

class chessController {
    constructor(p5) {
        this.Light = [];
        this.Dark = [];
        this.isCommanding = false;
        this.commandPlayer = 0;
        this.size = 20;
    }
    initOne = (p5) => {
        let _r = 1;
        //let _r = p5.int(p5.random(2));
        let _c = new chess(p5, p5.random(200) - 100, p5.random(200) - 100, this.size, _r);
        if (_r === 0) {
            this.Light.push(_c);
        } else {
            this.Dark.push(_c);
        }
    }
    nameIt = (p5) => {
        p5.textSize(20);
        p5.fill(255,255,255);
        for (let i = 0;i < this.Light.length;i++) {
            p5.text(this.name, this.Light[i].pos[0], this.Light[i].pos[1]);
        }
    }
    setOneLight = (p5) => {
        if (this.Dark.length > 0) {
            let a = this.Dark.pop();
            a.mode = 0;
            this.Light.push(a);
        }
    }
    addOneDark = (p5) => {
        let _c = new chess(p5, p5.random(200) - 100, p5.random(200) - 100, this.size, 1);
        this.Dark.push(_c);
    }
    update = (p5, props) => {
        for (let i = 0; i < this.Dark.length; i++) {
            if (this.Light.length >= 3 && scan(p5, this.Dark[i].pos, this.Light)[0]) {
                this.Dark[i].mode = 2;
            } else {
                this.Dark[i].mode = 1;
            }
            this.Dark[i].update(p5);
        }
        for (let i = 0; i < this.Light.length; i++) {
            this.Light[i].update(p5);
        }
    }
    reset = (p5) => {
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].reset(p5);
        }
    }
}

class chess {
    constructor(p5, _x, _y, _s, _m) {
        this.pos = [_x, _y];
        this.dir = [(p5.int(p5.random(2)) - 0.5), (p5.int(p5.random(2)) - 0.5)];
        this.scale = _s;
        this.speed = (p5.random(3) + 0.2);
        this.mode = _m;
        this.name = 'nono';
    }
    update = (p5, props) => {
        if (this.mode === 0) {
            p5.shader(theShader);
            p5.push();
            p5.translate(this.pos[0], this.pos[1]);
            p5.push();
            p5.rotateX(p5.PI / 2);
            p5.scale(this.scale);
            p5.model(chessModel);
            p5.pop();
            p5.pop();
        } else if (this.mode === 2) {
            p5.resetShader();
            p5.ambientMaterial(100);
            p5.push();
            p5.translate(this.pos[0], this.pos[1]);
            p5.push();
            p5.rotateX(p5.PI / 2);
            p5.scale(this.scale);
            p5.model(chessModel);
            p5.pop();
            p5.pop();
        } else {
            p5.resetShader();
            p5.ambientMaterial(20);
            p5.push();
            p5.translate(this.pos[0], this.pos[1]);
            p5.push();
            p5.rotateX(p5.PI / 2);
            p5.scale(this.scale);
            p5.model(chessModel);
            p5.pop();
            p5.pop();
        }
        if (this.pos[0] > -300 && this.pos[0] < 300) {

        } else {
            this.dir[0] = -this.dir[0];
        }
        if (this.pos[1] > -200 && this.pos[1] < 200) {

        } else {
            this.dir[1] = -this.dir[1];
        }
        this.pos[0] += this.dir[0] * this.speed;
        this.pos[1] += this.dir[1] * this.speed;
    }
    reset = (p5) => {
        this.pos[0] = p5.random(200) - 100;
        this.pos[1] = p5.random(200) - 100;
        this.mode = 1;
    }
}

function scan(p5, p, l) {
    let ret = [];
    for (let i = 0; i < l.length - 2; i++) {
        for (let j = i + 1; j < l.length - 1; j++) {
            for (let k = j + 1; k < l.length; k++) {
                let ans = inInRange(p5, l[i].pos, l[j].pos, l[k].pos, p);
                if (ans === true) {
                    ret.push(true);
                    ret.push(l[i]);
                    ret.push(l[j]);
                    ret.push(l[k]);
                    return ret;
                }
            }
        }
    }
    return ([false]);
}

function inInRange(p5, a, b, c, t) {
    let v1 = [a[0] * 1.00, a[1] * 1.00];
    let v2 = [(b[0] - a[0]) * 1.00, (b[1] - a[1]) * 1.00];
    let v3 = [(c[0] - a[0]) * 1.00, (c[1] - a[1]) * 1.00];
    let u = (t[0] - t[1] * (v3[0] / v3[1]) - v1[0] + v1[1] * (v3[0] / v3[1])) / (v2[0] - v2[1] * (v3[0] / v3[1]));
    let v = (t[0] - v1[0] - v2[0] * u) / v3[0];
    if (u >= 0 && v >= 0 && u + v <= 1) {
        return true;
    }
    return false;
}