/**
 * SCENA: MEETING 2026 - ARCHITECTURAL FOUNTAIN & TRICASINA DETAIL
 */

// In cima a meeting_2026.js
import { drawGlobalChar as drawChar } from './sprites.js';

export function startMeeting2026(ctx, canvas) {
    const dialogueText = document.getElementById("dialogue-text");
    const btn = document.getElementById("continue-btn");
    const sceneState = { isFinished: false };
    
    const MAP_W = 2400; 
    const MAP_H = 1800;
    const TARGET_X = 1200; // Punto focale
    const TARGET_Y = 900;

    const players = [
        { id: "umberto", name: "UMBERTO", x: 1200, y: 900, color: "#1a2a40", colorDark: "#0d1520", hairColor: "#333333" },
        { id: "bubi", name: "BUBI", x: 1280, y: 920, color: "#2d5a27", colorDark: "#1a3517", hairColor: "#5D4037" },
        { id: "tonio", name: "TONIO", x: 1120, y: 920, color: "#7a2d2d", colorDark: "#4a1b1b", hairColor: "#222222" },
        { 
            id: "cece", 
            name: "CECE", 
            x: 1200, 
            y: 1350,       // Parte da fuori (in basso)
            targetY: 1000,  // Dove deve fermarsi
            color: "#f1c40f", 
            colorDark: "#f39c12", 
            hairColor: "#2c3e50", 
            visible: false,
            walking: false  // Nuova variabile
        }
    ];

    let camera = { x: 0, y: 0 };
    const dialogs = [
        { n: "BUBI", t: "Porcodiddio vagnoni, ma vi rendete conto? Siamo gli unici senza il video del 18esimo." },
        { n: "TONIO", t: "Per la Mamma Maria, maledetto covid..." },
        { n: "UMBERTO", t: "È un vuoto assurdo. Senza quel video è come se non fossimo mai diventati maggiorenni." },
        { n: "CECE", t: "Ou cujuni... se volete questo video ve lo genero io con l'AI! ahahahahah!" },
        { n: "UMBERTO", t: "Cece?! Che porcodio dici? L'AI non può mica ricostruire i ricordi!" },
        { n: "CECE", t: "Voi mi sottovalutate. Avvio protocollo: Gemini student a me!. Guardate e imparate!" }
    ];

    let currentIdx = 0;
    let glitchTimer = 0;
    if (dialogueText) dialogueText.innerText = `${dialogs[0].n}: ${dialogs[0].t}`;

    btn.onclick = () => {
        currentIdx++;
        if (currentIdx < dialogs.length) {
            // Se il personaggio che parla è CECE, lo facciamo partire
            if (dialogs[currentIdx].n === "CECE") {
                players[3].visible = true;
                players[3].walking = true; // Attiva il movimento
            }
            dialogueText.innerText = `${dialogs[currentIdx].n}: ${dialogs[currentIdx].t}`;
        } else {
            btn.style.display = "none";
            glitchTimer = 1; 
        }
    };

    // --- SISTEMA DI DISEGNO ARCHITETTONICO & FONTANA ---

    function drawPavement(cx, cy) {
        // 1. SFONDO TOTALE (Asfalto stradale scuro)
        ctx.fillStyle = "#2c2c2c"; 
        ctx.fillRect(0, 0, 2400, 1800);
    
        // 2. PARAMETRI PIAZZA (Rettangolo verticale allungato)
        const rectW = 1150;         // Larghezza (Stretta)
        const rectH = 1200;        // Altezza (Molto verticale)
        const cornerRadius = 120;  // Smussatura angoli
    
        // Calcolo coordinate per centrare la piazza sul punto (cx, cy)
        const x = cx - rectW / 2;
        const y = cy - rectH / 2;
    
        // 3. DISEGNO BASE PIETRA (Basoli chiari)
        ctx.fillStyle = "#dcd3bc"; 
        ctx.beginPath();
        // Crea il rettangolo con angoli arrotondati
        ctx.roundRect(x, y, rectW, rectH, cornerRadius);
        ctx.fill();
    
        // 4. TEXTURE BASOLI (Dettaglio architettonico interno)
        ctx.save();
        ctx.clip(); // Limita il disegno solo dentro la sagoma della piazza
    
        // Giunti orizzontali delle pietre
        ctx.strokeStyle = "rgba(184, 169, 143, 0.4)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < rectH; i += 40) {
            ctx.beginPath();
            ctx.moveTo(x, y + i);
            ctx.lineTo(x + rectW, y + i);
            ctx.stroke();
        }
    
        // Giunti verticali sfalsati (effetto mattonato reale)
        ctx.strokeStyle = "rgba(184, 169, 143, 0.25)";
        for (let row = 0; row < rectH; row += 40) {
            // Ogni riga spostiamo i giunti di 30px per sfalsarli
            const shift = (Math.floor(row / 40) % 2 === 0) ? 0 : 30;
            for (let col = 0; col < rectW + 60; col += 60) {
                ctx.beginPath();
                ctx.moveTo(x + col - shift, y + row);
                ctx.lineTo(x + col - shift, y + row + 40);
                ctx.stroke();
            }
        }
    
        ctx.restore();
    
        // 5. CORNICE DI BORDO (Il marciapiede/gradino)
        ctx.strokeStyle = "#b8a98f";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(x, y, rectW, rectH, cornerRadius);
        ctx.stroke();
    }

    function drawChurch(x, y) {
        const stone = "#e3d5b8"; const stoneDark = "#c9bba0";
        ctx.fillStyle = stone; ctx.fillRect(x - 200, y - 500, 400, 350);
        ctx.fillStyle = stoneDark; ctx.fillRect(x - 210, y - 510, 420, 20);
        ctx.fillStyle = stoneDark; ctx.fillRect(x - 50, y - 300, 100, 150);
        ctx.fillStyle = "#3e2723"; ctx.fillRect(x - 40, y - 290, 80, 140);
        ctx.beginPath(); ctx.arc(x, y - 400, 35, 0, Math.PI * 2); ctx.fillStyle = stoneDark; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y - 400, 25, 0, Math.PI * 2); ctx.fillStyle = "#1a1a1a"; ctx.fill();
        ctx.fillStyle = stone; ctx.fillRect(x + 120, y - 600, 60, 100);
        ctx.fillStyle = "#222"; ctx.fillRect(x + 135, y - 580, 30, 50);
    }

    // --- NUOVA FONTANA CENTRALE DETTAGLIATA ---
    function drawFontana(x, y) {
        const stoneDark = "#b8a98f";
        const waterColor = "#4fc3f7";

        // 1. Vasca esterna a gradoni (Pietra)
        ctx.fillStyle = "#999"; ctx.fillRect(x - 80, y - 10, 160, 30);
        ctx.fillStyle = "#aaa"; ctx.fillRect(x - 70, y - 20, 140, 20);
        ctx.fillStyle = stoneDark; ctx.fillRect(x - 60, y - 30, 120, 20);

        // 2. Acqua nella vasca principale (con effetto semi-trasparente)
        ctx.fillStyle = `rgba(79, 195, 247, 0.7)`;
        ctx.fillRect(x - 55, y - 28, 110, 16);

        // 3. Colonna centrale
        ctx.fillStyle = stoneDark;
        ctx.fillRect(x - 10, y - 90, 20, 70);

        // 4. Catino superiore (Pietra)
        ctx.beginPath();
        ctx.moveTo(x - 25, y - 90);
        ctx.lineTo(x + 25, y - 90);
        ctx.lineTo(x + 15, y - 80);
        ctx.lineTo(x - 15, y - 80);
        ctx.closePath();
        ctx.fillStyle = stoneDark;
        ctx.fill();

        // 5. Acqua che zampilla (Dettaglio pixel-art)
        if (glitchTimer === 0) {
            ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
            // Zampillo centrale
            ctx.fillRect(x - 1, y - 110, 2, 20);
            // Gocce che cadono nel catino
            ctx.fillRect(x - 12, y - 95, 2, 6);
            ctx.fillRect(x + 10, y - 95, 2, 6);
        }
    }

    // --- IL MITICO CARRO DI FANCIULLO ---
    function drawFanciullo(x, y) {
        // 1. Corpo del Furgone/Carro
        ctx.fillStyle = "#ffffff"; // Bianco lucido
        ctx.fillRect(x, y, 140, 80); 
        
        // 2. Tetto/Insegna superiore
        ctx.fillStyle = "#e53935"; // Rosso vivace
        ctx.fillRect(x - 5, y - 15, 150, 20);
        
        // Testo Insegna (Miniaturizzato)
        ctx.fillStyle = "white";
        ctx.font = "6px 'Press Start 2P'";
        ctx.fillText("FANCIULLO", x + 15, y - 2);

        // 3. Apertura del bancone (Il "cuore" del carro)
        ctx.fillStyle = "#333";
        ctx.fillRect(x + 10, y + 20, 120, 35);
        
        // Menù scritto piccolo sul fianco
        ctx.fillStyle = "#ffeb3b"; // Giallo neon
        ctx.font = "4px 'Press Start 2P'";
        ctx.fillText("Kebab - Wurstel - Crepes", x + 12, y + 70);

        // 4. Ruote e dettagli meccanici
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(x + 15, y + 75, 25, 10);
        ctx.fillRect(x + 100, y + 75, 25, 10);

        // 5. Luci del furgone (per dare l'effetto "serata")
        ctx.fillStyle = "rgba(255, 235, 59, 0.5)";
        ctx.beginPath();
        ctx.arc(x + 10, y + 35, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawCaffeCappuccini(ctx, x, y) {
        // --- EDIFICIO ---
        ctx.fillStyle = "#f5f5f5"; // Pietra chiara
        ctx.fillRect(x, y, 320, 220);
        
        // Cornicione superiore
        ctx.fillStyle = "#e0e0e0";
        ctx.fillRect(x - 5, y - 10, 330, 15);
    
        // --- INSEGNA ---
        ctx.fillStyle = "#4e342e"; // Marrone caffè
        ctx.fillRect(x + 20, y + 20, 240, 35);
        ctx.fillStyle = "white";
        ctx.font = "8px 'Press Start 2P'";
        ctx.fillText("CAFFÈ CAPPUCCINI", x + 35, y + 45);
    
        // --- VETRATE ---
        ctx.fillStyle = "#81d4fa"; // Effetto vetro azzurrato
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x + 20, y + 75, 90, 110);
        ctx.fillRect(x + 130, y + 75, 90, 110);
        ctx.globalAlpha = 1.0;
    
        // Riflessi sulle vetrate
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(x + 30, y + 150); ctx.lineTo(x + 100, y + 85);
        ctx.stroke();
    
        // --- DEHOR (OMBRELLONI E TAVOLINI) ---
        function drawOmbrellone(ox, oy) {
            // Palo
            ctx.fillStyle = "#333";
            ctx.fillRect(ox - 2, oy, 4, 70);
            // Tavolino sotto l'ombrellone
            ctx.fillStyle = "#777";
            ctx.fillRect(ox - 15, oy + 50, 30, 5);
            // Ombrellone aperto (Vista frontale)
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(ox - 60, oy + 10);
            ctx.lineTo(ox + 60, oy + 10);
            ctx.lineTo(ox, oy - 30);
            ctx.closePath();
            ctx.fill();
            // Bordino ombrellone
            ctx.strokeStyle = "#ccc";
            ctx.stroke();
        }
    
        drawOmbrellone(x + 270, y + 150);
        drawOmbrellone(x + 360, y + 150);
    }

    // --- ARREDO URBANO: PANCHINE & LAMPIONI ---
    function drawUrbanFurniture(cx, cy) {
        const stone = "white ";
        const benchWidth = 80;

        // 4 Panchine intorno all'ellisse
        ctx.fillStyle = stone;
        ctx.fillRect(cx - 300, cy - 250, benchWidth, 20); // Panchina 1 (SX)
        ctx.fillRect(cx + 220, cy - 250, benchWidth, 20); // Panchina 2 (DX)
        ctx.fillRect(cx - 150, cy + 220, benchWidth, 20); // Panchina 3 (Basso-SX)
        ctx.fillRect(cx + 70, cy + 220, benchWidth, 20);  // Panchina 4 (Basso-DX)
        
        // Dettaglio gambe panchine
        ctx.fillStyle = "#666";
        ctx.fillRect(cx - 300, cy - 230, 10, 10); ctx.fillRect(cx - 230, cy - 230, 10, 10);
        ctx.fillRect(cx + 220, cy - 230, 10, 10); ctx.fillRect(cx + 290, cy - 230, 10, 10);

        // 2 Lampioni d'epoca (Dettaglio pixel-art ghisa)
        function drawLampione(lx, ly) {
            ctx.fillStyle = "#1a1a1a"; // Ghisa scura
            ctx.fillRect(lx - 4, ly, 8, 160); // Palo
            ctx.fillRect(lx - 12, ly, 24, 6); // Base allargata
            // Cima barocca accennata
            ctx.fillStyle = "#333";
            ctx.fillRect(lx - 15, ly - 20, 30, 25);
            // Lanterna (con luce accesa)
            ctx.fillStyle = "#fff176";
            ctx.fillRect(lx - 8, ly - 15, 16, 15);
        }
        drawLampione(cx - 450, cy); // Lampione 1
        drawLampione(cx + 450, cy); // Lampione 2
    }

    function drawLecci(x, y) {
        ctx.fillStyle = "#3e2723"; ctx.fillRect(x - 8, y, 16, 40);
        ctx.fillStyle = "#1b3022";
        ctx.beginPath(); ctx.arc(x, y - 20, 55, 0, Math.PI * 2); ctx.arc(x - 35, y - 45, 45, 0, Math.PI * 2); ctx.arc(x + 35, y - 45, 45, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#2d4c36";
        ctx.beginPath(); ctx.arc(x - 15, y - 50, 18, 0, Math.PI * 2); ctx.fill();
    }



    function loop() {
        if (sceneState.isFinished) return;
        camera.x = TARGET_X - canvas.width / 2;
        camera.y = TARGET_Y - (canvas.height * 0.55);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        // Nel loop:
        if (glitchTimer > 0) {
            glitchTimer += 1.2; // Incremento più lento (prima era 1.5)
            ctx.translate((Math.random()-0.5) * (glitchTimer/3), (Math.random()-0.5) * (glitchTimer/3));
            
            if (glitchTimer > 250) { // Limite alzato (prima era 150)
                sceneState.isFinished = true;
            }
        }
        ctx.translate(-camera.x, -camera.y);
        
        drawPavement(1200, 900);
        drawChurch(1200, 600);
        
        // Inseriamo gli arredi urbani SOTTO i personaggi
        drawUrbanFurniture(1200, 900);

        drawCaffeCappuccini(ctx, 500, 540); // Coord (700, 500) lo mette in alto a sinistra
        
        drawFanciullo(1600, 600); // Posizionato sulla destra rispetto al gruppo
        
        // Inseriamo la fontana SOTTO i personaggi ma SOPRA il pavimento
        drawFontana(1200, 900);
        
        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            drawLecci(1200 + Math.cos(angle)*600, 900 + Math.sin(angle)*600);
        }

        // --- LOGICA MOVIMENTO CECE (Stile Pokémon) ---
        const cece = players.find(p => p.id === "cece");
        if (cece && cece.walking) {
            if (cece.y > cece.targetY) {
                cece.y -= 2.5; // Lo fa salire verso il gruppo
            } else {
                cece.walking = false; // Si ferma quando arriva a destinazione
            }
        }

        // --- DISEGNO PERSONAGGI ---
        players.forEach(p => {
            // Chiamiamo la funzione globale passando ctx, il player e il timer del glitch
            drawChar(ctx, p, glitchTimer); 
        });

        if (glitchTimer > 0) {
            ctx.restore(); ctx.fillStyle = `rgba(0, 255, 100, ${glitchTimer/250})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.save();
        } else { ctx.restore(); }

        requestAnimationFrame(loop);
    }
    loop();
    return sceneState;
}