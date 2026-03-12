/**
 * SCENA: MEETING 2026 - FULL DETAIL VERSION
 */
export function startMeeting2026(ctx, canvas) {
    const dialogueText = document.getElementById("dialogue-text");
    const btn = document.getElementById("continue-btn");
    const sceneState = { isFinished: false };
    let animationId;
  
    const MAP_W = 2000;
    const MAP_H = 1500;
  
    const camera = {
      x: 1000 - canvas.width / 2, 
      y: 800 - canvas.height / 2,
      w: canvas.width, 
      h: canvas.height
    };
  
    const players = [
        { id: "umberto", name: "UMBERTO", x: 1000, y: 800, color: "#1a2a40", colorDark: "#0d1520", hairColor: "#333333" },
        { id: "bubi", name: "BUBI", x: 1050, y: 820, color: "#2d5a27", colorDark: "#1a3517", hairColor: "#5D4037" },
        { id: "tonio", name: "TONIO", x: 950, y: 820, color: "#7a2d2d", colorDark: "#4a1b1b", hairColor: "#222222" }
    ];
  
    const sceneData = { glitchActive: false, glitchTimer: 120 };
    const dialogs = [
      "Tricase, Piazza Cappuccini - 2026.",
      "Bubi: 'Wagliù, guardate che movimento stasera...'",
      "Tonio: 'Tricase è cambiata, ma la pietra leccese non invecchia mai.'",
      "Umberto: 'E il Wi-Fi ora vola. Guardate, provo a scaricare la mappa storica...'",
      "SISTEMA: Errore di connessione. Interferenza magnetica in corso...",
      "Umberto: 'Che succede al telefono?! Sta vibrando fortissimo!'"
    ];
  
    let currentIdx = 0;
    if (dialogueText) dialogueText.innerText = dialogs[currentIdx];
  
    btn.onclick = () => {
      currentIdx++;
      if (currentIdx < dialogs.length) {
        dialogueText.innerText = dialogs[currentIdx];
        if (currentIdx === dialogs.length - 1) {
          sceneData.glitchActive = true;
          btn.style.display = "none";
        }
      }
    };
  
    function drawWorld() {
      const cx = 1000; 
      const cy = 750;
  
      // 1. Pavimentazione generale
      ctx.fillStyle = "#333"; 
      ctx.fillRect(0, 0, MAP_W, MAP_H);
  
      // 2. Area Circolare (Basoli bianchi/beige)
      ctx.fillStyle = "#dcd3bc"; 
      ctx.beginPath();
      ctx.arc(cx, cy, 350, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#b8a98f";
      ctx.lineWidth = 10;
      ctx.stroke();
  
      // 3. Il Monumento ai Caduti
      ctx.fillStyle = "#999"; 
      ctx.fillRect(cx - 40, cy - 40, 80, 80); // Base
      ctx.fillStyle = "#bbb";
      ctx.fillRect(cx - 25, cy - 25, 50, 50); // Gradone
      ctx.fillStyle = "#777";
      ctx.fillRect(cx - 10, cy - 120, 20, 100); // Obelisco
  
      // 4. La Chiesa di Sant'Antonio
      ctx.fillStyle = "#e3d5b8"; 
      ctx.fillRect(cx - 150, cy - 600, 300, 250); // Facciata
      ctx.fillStyle = "#3b2416";
      ctx.fillRect(cx - 30, cy - 430, 60, 80); // Portone
      ctx.beginPath();
      ctx.arc(cx, cy - 520, 25, 0, Math.PI * 2);
      ctx.fillStyle = "#222";
      ctx.fill();
  
      // 5. I Lecci (Alberi)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const tx = cx + Math.cos(angle) * 420;
        const ty = cy + Math.sin(angle) * 420;
        ctx.fillStyle = "#4a2e19";
        ctx.fillRect(tx - 5, ty, 10, 20);
        ctx.fillStyle = "#1e3d1e";
        ctx.beginPath();
        ctx.arc(tx, ty - 15, 40, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  
    function drawChar(p) {
        const PIXEL = 2;
        ctx.save();
        ctx.translate(p.x, p.y);
  
        // Ombra
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath(); ctx.ellipse(16, 42, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
  
        // Corpo e Maniche
        ctx.fillStyle = p.color;
        ctx.fillRect(4, 14, 24, 20); 
        ctx.fillStyle = p.colorDark || p.color;
        ctx.fillRect(2, 16, 2, 12); 
        ctx.fillRect(28, 16, 2, 12);
  
        // Testa e Viso Dettagliato
        ctx.fillStyle = "#efd0b1";
        ctx.fillRect(6, 0, 20, 18);
        ctx.fillStyle = "#000"; 
        ctx.fillRect(10, 8, PIXEL, PIXEL); // Occhio SX
        ctx.fillRect(20, 8, PIXEL, PIXEL); // Occhio DX
        ctx.fillRect(14, 14, 4, PIXEL);    // Bocca
  
        // Capelli Specifici
        ctx.fillStyle = p.hairColor;
        if (p.id === "umberto") {
            ctx.fillRect(6, -2, 20, 6); ctx.fillRect(4, 2, 2, 4); ctx.fillRect(26, 2, 2, 4);
        } else if (p.id === "bubi") {
            ctx.fillRect(4, -4, 24, 8); ctx.fillRect(2, 0, 2, 10); ctx.fillRect(28, 0, 2, 10); ctx.fillRect(10, -6, 12, 2);
        } else {
            ctx.fillRect(8, 0, 16, 4); ctx.fillRect(6, 2, 2, 2); ctx.fillRect(24, 2, 2, 2);
        }
  
        // Gambe (Statiche in questa scena)
        ctx.fillStyle = "#333";
        ctx.fillRect(8, 32, 6, 12); ctx.fillRect(18, 32, 6, 12);
  
        // Nome Label
        ctx.fillStyle = "white"; 
        ctx.font = "8px 'Press Start 2P'"; 
        ctx.textAlign = "center";
        ctx.fillText(p.name, 16, -15);
        ctx.restore();
    }
  
    function update() {
      if (sceneState.isFinished) return;
      camera.x += (players[0].x - canvas.width / 2 - camera.x) * 0.05;
      camera.y += (players[0].y - canvas.height / 2 - camera.y) * 0.05;
  
      if (sceneData.glitchActive) {
        sceneData.glitchTimer--;
        if (sceneData.glitchTimer <= 0) {
          sceneState.isFinished = true;
        }
      }
    }
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-camera.x, -camera.y);
  
      if (sceneData.glitchActive) {
        ctx.rotate((120 - sceneData.glitchTimer) * 0.0005); 
      }
  
      drawWorld();
      players.forEach(p => drawChar(p));
  
      if (sceneData.glitchActive) {
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = `rgba(${Math.random()*255}, 255, 255, 0.4)`;
          ctx.fillRect(camera.x + Math.random()*camera.w, camera.y + Math.random()*camera.h, Math.random()*300, 2);
        }
      }
      ctx.restore();
  
      if (sceneData.glitchActive && sceneData.glitchTimer < 30) {
        ctx.fillStyle = `rgba(255,255,255, ${1 - sceneData.glitchTimer/30})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  
    function loop() {
      if (sceneState.isFinished) {
          cancelAnimationFrame(animationId);
          return;
      }
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    }
  
    loop();
    return sceneState;
}