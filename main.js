import { startIntro } from './scenes/intro.js';
import { startMeeting2026 } from './scenes/meeting_2026.js';
import { startBubiHome2015 } from "./scenes/bubi_home_2015.js";

const GameState = {
    // 1. Cambia la scena iniziale in INTRO
    currentScene: "INTRO", 
    ctx: null,
    canvas: null,
    sceneHandle: null,

    update() {
        // Controlla se la scena corrente ha finito (isFinished diventerà true)
        if (this.sceneHandle && this.sceneHandle.isFinished) {
            this.nextStep();
        }
        requestAnimationFrame(() => this.update());
    },

    nextStep() {
        // 2. Aggiorna la sequenza: la intro porta al meeting
        const sequence = {
            "INTRO": "MEETING_2026",
            "MEETING_2026": "BUBI_HOME_2015",
            "BUBI_HOME_2015": "BUBI_SCHOOL_STAMPACCHIA"
        };
        
        const next = sequence[this.currentScene];
        if (next) {
            this.currentScene = next;
            this.run();
        }
    },

    run() {
        // Pulizia eventi del tasto "Continua" (per evitare doppie chiamate)
        const btn = document.getElementById("continue-btn");
        if (btn) {
            btn.style.display = "block";
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        }

        // 3. Gestione del lancio della Intro
        if (this.currentScene === "INTRO") {
            this.sceneHandle = startIntro(this.ctx, this.canvas);
        } else if (this.currentScene === "MEETING_2026") {
            this.sceneHandle = startMeeting2026(this.ctx, this.canvas);
        } else if (this.currentScene === "BUBI_HOME_2015") {
            this.sceneHandle = startBubiHome2015(this.ctx, this.canvas);
        }
    }
};

// SETUP CANVAS RESPONSIVE
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// CSS per garantire il full screen senza scroll
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.display = "block";
canvas.style.zIndex = "1";
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.getElementById("game-container").appendChild(canvas);

const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Se la scena ha una funzione interna di resize, la chiamiamo
    if (GameState.sceneHandle && GameState.sceneHandle.onResize) {
        GameState.sceneHandle.onResize(canvas.width, canvas.height);
    }
};

window.addEventListener("resize", handleResize);
handleResize(); // Primo calcolo

GameState.ctx = ctx;
GameState.canvas = canvas;
GameState.run();
GameState.update();