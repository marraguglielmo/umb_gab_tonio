export function startBubiIntro(ctx, canvas, onComplete) {
    const dialogueText = document.getElementById("dialogue-text");
    const btn = document.getElementById("continue-btn");
    let animationId;
    let finished = false;
  
    const player = { 
      x: 400, y: 500, w: 32, h: 42, speed: 3.2, 
      name: "BUBI", 
      color: "#2d5a27", colorDark: "#1a3517", hairColor: "#5D4037",
      frame: 0, frameTick: 0, moving: false 
    };
  
    const camera = { x: 0, y: 0, smooth: 0.08 };
    let introActive = true;
    const keys = { w:false, a:false, s:false, d:false, arrowup:false, arrowdown:false, arrowleft:false, arrowright:false };

    // --- DIALOGHI BUBI ---
    const introTexts = [
      "Bubi: 'Ahi... la testa...'",
      "Bubi: 'Ma dove sono? Piazza Pisanelli? Sembra pulitissima...'",
      "Bubi: 'Ehi! Quel tizio ha un Nokia 3310! In che anno siamo?!'",
      "Bubi: 'Devo trovare gli altri. Magari sono al solito posto...'"
    ];
    let introIndex = 0;

    if (dialogueText && btn) {
      dialogueText.innerText = introTexts[0];
      btn.style.display = "block";
      btn.onclick = (e) => {
        e.stopPropagation();
        introIndex++;
        if (introIndex < introTexts.length) {
          dialogueText.innerText = introTexts[introIndex];
        } else {
          btn.style.display = "none";
          dialogueText.innerText = "Esplora la Piazza con WASD.";
          introActive = false;
        }
      };
    }

    const handleKeyDown = (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function drawChar(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        // Ombra
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath(); ctx.ellipse(16, 42, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
        // Corpo (Verde Bubi)
        ctx.fillStyle = p.color; ctx.fillRect(4, 14, 24, 20);
        // Testa
        ctx.fillStyle = "#efd0b1"; ctx.fillRect(6, 0, 20, 18);
        // Capelli (Mossi/Castani)
        ctx.fillStyle = p.hairColor;
        ctx.fillRect(4, -4, 24, 8); ctx.fillRect(2, 0, 2, 10);
        ctx.restore();
    }

    function update() {
        if (introActive || finished) return; // Se finito, non fare più nulla

      let dx = 0, dy = 0;
      if (keys.w || keys.arrowup) dy -= player.speed;
      if (keys.s || keys.arrowdown) dy += player.speed;
      if (keys.a || keys.arrowleft) dx -= player.speed;
      if (keys.d || keys.arrowright) dx += player.speed;

      player.moving = dx !== 0 || dy !== 0;
      player.x += dx; player.y += dy;

      camera.x += (player.x - canvas.width / 4 - camera.x) * camera.smooth;
      camera.y += (player.y - canvas.height / 4 - camera.y) * camera.smooth;
    }
  
    function draw() {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.save();
      ctx.translate(-camera.x, -camera.y);
  
      // Piazza Pisanelli (Pavimento chiaro)
      ctx.fillStyle = "#e0d7c6";
      ctx.fillRect(0, 0, 1500, 1000);
  
      // Gradini Chiesa Matrice
      ctx.fillStyle = "#c5b8a5";
      ctx.fillRect(400, 100, 400, 150);
  
      drawChar(player);
      ctx.restore();
    }
  
    function loop() {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    }
    loop();

    return animationId;
}