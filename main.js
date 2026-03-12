import { startUmbertoIntro } from "./scenes/umberto_intro.js";

// container
const container = document.getElementById("game-container");

// create canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// device pixel ratio support (crisp rendering)
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// canvas styles
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.display = "block";
canvas.style.zIndex = "0";

// page styles
document.body.style.margin = "0";
document.body.style.overflow = "hidden";

// append canvas
if (container) {
  container.appendChild(canvas);
} else {
  document.body.appendChild(canvas);
}

// dialogue box stays above canvas
const dialogueBox = document.getElementById("dialogue-box");
if (dialogueBox) {
  dialogueBox.style.position = "fixed";
  dialogueBox.style.left = "50%";
  dialogueBox.style.bottom = "24px";
  dialogueBox.style.transform = "translateX(-50%)";
  dialogueBox.style.zIndex = "10";
  dialogueBox.style.maxWidth = "900px";
  dialogueBox.style.width = "calc(100vw - 40px)";
}

// initial size
resizeCanvas();

// resize listener
window.addEventListener("resize", resizeCanvas);

// start scene
startUmbertoIntro(ctx, canvas);