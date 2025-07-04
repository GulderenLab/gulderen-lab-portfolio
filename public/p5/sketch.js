let svgs = [];
let index = 0;
let timer = 0;

function preload() {
  svgs[0] = loadImage("m1_kesimde_1.svg");
  svgs[1] = loadImage("m1_iletimde_2.svg");
  svgs[2] = loadImage("m1_kesimde_3.svg");
  svgs[3] = loadImage("m1_iletimde_4.svg");
}

function setup() {
  const container = document.getElementById('sketch-holder');
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  let cnv = createCanvas(w, h);
  cnv.parent(container);
  imageMode(CENTER);
  frameRate(30);
  timer = millis();
}

function windowResized() {
  const container = document.getElementById('sketch-holder');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}

function draw() {
  background(255);

  const maxW = width * 0.9;
  const maxH = height * 0.8;
  const aspectRatio = 4 / 3;
  let imgW = maxW;
  let imgH = imgW / aspectRatio;

  if (imgH > maxH) {
    imgH = maxH;
    imgW = imgH * aspectRatio;
  }

  if (svgs[index]) {
    image(svgs[index], width / 2, height / 2, imgW, imgH);
  }

  if (millis() - timer > 3000) {
    index = (index + 1) % svgs.length;
    timer = millis();
  }

  fill(0);
  textAlign(CENTER);
  textSize(min(24, width * 0.04));
  text(getLabel(index), width / 2, 40);
}

function getLabel(i) {
  return [
    "KESİM MODU 1",
    "İLETİM MODU 2",
    "KESİM MODU 3",
    "İLETİM MODU 4"
  ][i];
}
