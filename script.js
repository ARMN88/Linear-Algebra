eruda.init();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.setTransform(1, 0, 0, -1, canvas.width/2,canvas.height/2);

canvas.style.backgroundColor = 'black';

let spacing = 100;

let fov = 0.8;

let movement = "spin";
let x = 0;
let y = 0;

let shape = "cube";

window.onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  ctx.setTransform(1, 0, 0, -1, canvas.width/2,canvas.height/2);
}

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = Math.sqrt(this.x*this.x + this.y*this.y);
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.length = Math.sqrt(this.x*this.x + this.y*this.y);
    return this;
  }
  multiply(float) {
    this.x *= float;
    this.y *= float;
    this.length = Math.sqrt(this.x*this.x + this.y*this.y);
    return this;
  }
  transform(ihat, jhat) {
    this.x = ihat.x * this.x + jhat.x * this.y;
    this.y = ihat.y * this.x + jhat.y * this.y;
    this.length = Math.sqrt(this.x*this.x + this.y*this.y);
    return this;
  }
  normalize() {
    this.x = this.x/this.length;
    this.y = this.y/this.length;
    return this;
  }
  magnitude() {
    this.length = Math.sqrt(this.x*this.x + this.y*this.y);
    return this;
  }
  draw(type = "direction", thickness = 2) {
    ctx.strokeStyle = ctx.fillStyle;
    if(type === "point") {
      ctx.beginPath();
      ctx.arc(this.x, this.y, thickness, 0, 2 * Math.PI);
      ctx.fill();
    }else if(type === "direction") {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.x, this.y);
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }
}

// main cube
let v1 = new Vector2(100, 100);
let v2 = new Vector2(100, 50);
let v3 = new Vector2(50, 50);
let v4 = new Vector2(50, 100);

// back cube
let v5 = new Vector2(20, 20);
let v6 = new Vector2(20, -20);
let v7 = new Vector2(-20, -20);
let v8 = new Vector2(-20, 20);

let t = 0;
function Update() {
  t += Math.PI/100;
  requestAnimationFrame(Update);
  ctx.clearRect(-canvas.width/2, canvas.height/2, canvas.width, -canvas.height);
  drawAxis();

  if(movement === "spin") {
    x = Math.cos(t);
    y = Math.sin(t);
  }else if(movement === "still") {
    x = 0;
    y = 0;
  }

  if(shape === "cube") {
    // Cube
    v1 = new Vector2(x * spacing+spacing/2, y *  spacing+spacing/2);

    v2 = new Vector2(x * spacing+spacing/2, y * spacing-spacing/2);

    v3 = new Vector2(x * spacing-spacing/2, y * spacing-spacing/2);

    v4 = new Vector2(x * spacing-spacing/2, y *  spacing+spacing/2);
  }else if(shape === "rhombus") {
    // Rhombus
    v1 = new Vector2(x * spacing+spacing, y *  spacing+spacing/2);

    v2 = new Vector2(x * spacing+spacing/2, y * spacing-spacing/5);

    v3 = new Vector2(x * spacing-spacing/2, y * spacing-spacing/5);

    v4 = new Vector2(x * spacing, y *  spacing+spacing/2);
  }else if(shape === "tri2") {
    // Right Triangle
    v1 = new Vector2(x * spacing+spacing/2, y *  spacing+spacing/2);

    v2 = new Vector2(x * spacing+spacing/2, y * spacing-spacing/2);

    v3 = new Vector2(x * spacing-spacing/2, y * spacing-spacing/2);

    v4 = new Vector2(x * spacing+spacing/2, y *  spacing+spacing/2);
  }else if(shape === "tri1") {
    // Equilateral Triangle
    v1 = new Vector2(x * spacing, y *  spacing+spacing/2);

    v2 = new Vector2(x * spacing+spacing/2, y * spacing-spacing/2);

    v3 = new Vector2(x * spacing-spacing/2, y * spacing-spacing/2);

    v4 = new Vector2(x * spacing, y *  spacing+spacing/2);
  }
  
  ctx.strokeStyle = "white";
  ctx.fillStyle = "black";
  v5.x = v1.x;
  v5.y = v1.y;
  v5.multiply(fov);
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  ctx.lineTo(v5.x, v5.y);
  ctx.stroke();
  
  v6.x = v2.x;
  v6.y = v2.y;
  v6.multiply(fov);
  ctx.beginPath();
  ctx.moveTo(v2.x, v2.y);
  ctx.lineTo(v6.x, v6.y);
  ctx.stroke();
  
  v7.x = v3.x;
  v7.y = v3.y;
  v7.multiply(fov);
  ctx.beginPath();
  ctx.moveTo(v3.x, v3.y);
  ctx.lineTo(v7.x, v7.y);
  ctx.stroke();

  v8.x = v4.x;
  v8.y = v4.y;
  v8.multiply(fov);
  ctx.beginPath();
  ctx.moveTo(v4.x, v4.y);
  ctx.lineTo(v8.x, v8.y);
  ctx.stroke();

  Connect(v5, v6, v7, v8);
  Connect(v1, v2, v3, v4);
}

window.onload = function() {
  Update();
}

function drawAxis(showGrid=true, spacing=50) {
  if(showGrid) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#adadad";
    for(let x = spacing; x < canvas.width; x+=spacing) {
      ctx.beginPath();
      ctx.moveTo(x, -canvas.height/2);
      ctx.lineTo(x, canvas.height/2);
      ctx.stroke();
    }
    for(let x = -spacing; x > -canvas.width; x-=spacing) {
      ctx.beginPath();
      ctx.moveTo(x, -canvas.height/2);
      ctx.lineTo(x, canvas.height/2);
      ctx.stroke();
    }
    for(let y = spacing; y < canvas.height; y+=spacing) {
      ctx.beginPath();
      ctx.moveTo(-canvas.width/2, y);
      ctx.lineTo(canvas.width/2, y);
      ctx.stroke();
    }
    for(let y = -spacing; y > -canvas.height; y-=spacing) {
      ctx.beginPath();
      ctx.moveTo(-canvas.width/2, y);
      ctx.lineTo(canvas.width/2, y);
      ctx.stroke();
    }
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(-canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, 0);
  ctx.stroke();

  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.moveTo(0, -canvas.height/2);
  ctx.lineTo(0, canvas.height/2);
  ctx.stroke();
}

function Connect(...vectors) {
  let previousVector;
  for(vector of vectors) {
    if(previousVector) {
      ctx.lineTo(vector.x, vector.y);
      previousVector = {
        x: vector.x,
        y: vector.y
      }
    }else {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(vector.x, vector.y);
      previousVector = {
        x: vector.x,
        y: vector.y
      }
    }
  }
  ctx.lineTo(vectors[0].x, vectors[0].y);
  ctx.stroke();
}

window.onmousemove = (e) => {
  if(movement === "mouse") {
    x = (e.clientX - canvas.width/2)/spacing;
    y = -(e.clientY - canvas.height/2)/spacing;
  }
}

document.querySelector("#size").oninput = function() {
  spacing = this.value;
}

document.querySelector("#fov").oninput = function() {
  fov = this.value/10;
}

document.querySelector("#movement").oninput = function() {
  movement = this.value;
}

document.querySelector("#shape").oninput = function() {
  shape = this.value;
  console.log(shape);
}
