export function startBubiHome2015(ctx, canvas) {
  const dialogueText = document.getElementById("dialogue-text");
  const btn = document.getElementById("continue-btn");
  const sceneState = { isFinished: false };
  let introActive = true;

  const player = { 
      id: "bubi", x: 150, y: 450, speed: 4, 
      name: "BUBI", color: "#2d5a27", colorDark: "#1a3517", hairColor: "#5D4037",
      moving: false, frameCounter: 0
  };

  const keys = { d: false, arrowright: false };
  window.onkeydown = (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true; };
  window.onkeyup = (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false; };

  dialogueText.innerText = "Bubi: '*Mmmh*... ma che sogno assurdo ho fatto? Piazza Cappuccini... Cece... l'AI...'";
  btn.style.display = "block";
  btn.onclick = () => {
      dialogueText.innerText = "Bubi: 'Vabbè, meglio che mi sbrigo. Lo Stampacchia non aspetta!'";
      btn.onclick = () => {
          btn.style.display = "none";
          introActive = false;
      };
  };

  function drawChar(p) {
      const PIXEL = 2;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(16, 42, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = p.color; ctx.fillRect(4, 14, 24, 20);
      ctx.fillStyle = p.colorDark; ctx.fillRect(2, 16, 2, 12); ctx.fillRect(28, 16, 2, 12);
      ctx.fillStyle = "#efd0b1"; ctx.fillRect(6, 0, 20, 18);
      ctx.fillStyle = "#000"; ctx.fillRect(10, 8, PIXEL, PIXEL); ctx.fillRect(20, 8, PIXEL, PIXEL);
      ctx.fillRect(14, 14, 4, PIXEL);
      ctx.fillStyle = p.hairColor;
      ctx.fillRect(4, -4, 24, 8); ctx.fillRect(2, 0, 2, 10); ctx.fillRect(28, 0, 2, 10);
      
      ctx.fillStyle = "#333";
      if (p.moving) {
          let off = Math.sin(p.frameCounter * 0.2) * 5;
          ctx.fillRect(8, 32 + off, 6, 12 - off);
          ctx.fillRect(18, 32 - off, 6, 12 + off);
      } else {
          ctx.fillRect(8, 32, 6, 12); ctx.fillRect(18, 32, 6, 12);
      }
      ctx.restore();
  }

  function loop() {
      if (sceneState.isFinished) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stanza di Bubi (Dettagliata)
      ctx.fillStyle = "#4e342e"; ctx.fillRect(0, 400, canvas.width, 200); // Pavimento
      ctx.fillStyle = "#e0e0e0"; ctx.fillRect(0, 100, canvas.width, 300); // Muro
      ctx.fillStyle = "#1565c0"; ctx.fillRect(50, 420, 140, 70); // Letto

      if (!introActive) {
          player.moving = keys.d || keys.arrowright;
          if (player.moving) player.x += player.speed;
          player.frameCounter++;
          if (player.x > canvas.width) sceneState.isFinished = true;
      }

      drawChar(player);
      requestAnimationFrame(loop);
  }
  loop();
  return sceneState;
}