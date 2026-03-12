import { startMeeting2026 } from "./scenes/meeting_2026.js";
import { startUmbertoIntro } from "./scenes/umberto_intro.js";

const GameState = {
    currentScene: "MEETING_2026",
    ctx: null,
    canvas: null,
    sceneHandle: null, 

    update() {
        // Monitoraggio: se la scena dice di aver finito, cambiamo
        if (this.sceneHandle && this.sceneHandle.isFinished) {
            this.nextStep();
        }
        requestAnimationFrame(() => this.update());
    },

    nextStep() {
        if (this.currentScene === "MEETING_2026") {
            this.currentScene = "INTRO_UMBERTO";
            this.run();
        } else {
            console.log("Fine della parte 1: Umberto è arrivato a destinazione.");
            this.sceneHandle = null; // Ferma tutto
        }
    },

    run() {
        // Reset grafico totale
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Reset del Bottone (clonazione per pulire eventi vecchi)
        const btn = document.getElementById("continue-btn");
        if (btn) {
            btn.style.display = "block";
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        }

        // Caricamento Scena
        if (this.currentScene === "MEETING_2026") {
            this.sceneHandle = startMeeting2026(this.ctx, this.canvas);
        } else if (this.currentScene === "INTRO_UMBERTO") {
            this.sceneHandle = startUmbertoIntro(this.ctx, this.canvas);
        }
    }
};

// Setup Canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.style.position = "fixed"; canvas.style.top = "0"; canvas.style.left = "0"; canvas.style.zIndex = "1";
document.getElementById("game-container").appendChild(canvas);

const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
window.addEventListener("resize", resize);
resize();

GameState.ctx = ctx;
GameState.canvas = canvas;
GameState.run();
GameState.update();