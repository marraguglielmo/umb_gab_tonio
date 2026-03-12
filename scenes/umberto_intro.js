/**
 * SCENA: INTRO UMBERTO (LUCUGNANO 2015) - FULL DETAIL
 */
export function startUmbertoIntro(ctx, canvas) {
    const dialogueText = document.getElementById("dialogue-text");
    const btn = document.getElementById("continue-btn");
    const sceneState = { isFinished: false };
    let introActive = true;
    let animationId;

    const player = { 
        id: "umberto", x: 200, y: 450, speed: 3.5, 
        name: "UMBERTO", color: "#1a2a40", colorDark: "#0d1520", hairColor: "#333333",
        moving: false, frameCounter: 0
    };

    // Camera centrata sulla stanza iniziale
    const camera = { x: 0, y: 150, smooth: 0.1 };
    const keys = { d: false, arrowright: false, a: false, arrowleft: false };
    
    // Gestione Input pulita
    const handleKeyDown = (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const texts = [
        "Umberto: '*Sbadiglio*... che dormita strana.'",
        "Umberto: 'Sembrava così reale... la piazza, Bubi, Tonio...'",
        "Umberto: 'Vabbè, meglio muoversi o farò tardi al Liceo Stampacchia!'"
    ];
    let msgIdx = 0;

    if (dialogueText && btn) {
        dialogueText.innerText = texts[0];
        btn.style.display = "block";
        btn.onclick = () => {
            msgIdx++;
            if (msgIdx < texts.length) {
                dialogueText.innerText = texts[msgIdx];
            } else {
                btn.style.display = "none";
                dialogueText.innerText = "Esci di casa e vai verso il Liceo (DESTRA)";
                introActive = false;
            }
        };
    }

    function drawChar(p) {
        const PIXEL = 2;
        ctx.save();
        ctx.translate(p.x, p.y);
        
        // Ombra (Coerente con Meeting)
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath(); ctx.ellipse(16, 42, 12, 4, 0, 0, Math.PI * 2); ctx.fill();

        // Corpo
        ctx.fillStyle = p.color; ctx.fillRect(4, 14, 24, 20); 
        ctx.fillStyle = p.colorDark; ctx.fillRect(2, 16, 2, 12); ctx.fillRect(28, 16, 2, 12);

        // Testa (Pixel-Art Gold Standard)
        ctx.fillStyle = "#efd0b1"; ctx.fillRect(6, 0, 20, 18);
        ctx.fillStyle = "#000"; 
        ctx.fillRect(10, 8, PIXEL, PIXEL); // Occhio SX
        ctx.fillRect(20, 8, PIXEL, PIXEL); // Occhio DX
        ctx.fillRect(14, 14, 4, PIXEL);    // Bocca
        
        // Capelli Umberto (Sempre uguali)
        ctx.fillStyle = p.hairColor;
        ctx.fillRect(6, -2, 20, 6); ctx.fillRect(4, 2, 2, 4); ctx.fillRect(26, 2, 2, 4);

        // Animazione Gambe in movimento
        ctx.fillStyle = "#333";
        if (p.moving) {
            let legOffset = Math.sin(p.frameCounter * 0.2) * 6;
            ctx.fillRect(8, 32 + legOffset, 6, 12 - legOffset);
            ctx.fillRect(18, 32 - legOffset, 6, 12 + legOffset);
        } else {
            ctx.fillRect(8, 32, 6, 12); ctx.fillRect(18, 32, 6, 12);
        }
        
        ctx.fillStyle = "white"; ctx.font = "8px 'Press Start 2P'"; ctx.textAlign = "center";
        ctx.fillText(p.name, 16, -15);
        ctx.restore();
    }

    function drawHouse() {
        // Pavimento camera
        ctx.fillStyle = "#5d4037"; ctx.fillRect(0, 400, 600, 150);
        // Mura
        ctx.fillStyle = "#f5f5f5"; ctx.fillRect(0, 200, 600, 200);
        // Letto
        ctx.fillStyle = "#1565c0"; ctx.fillRect(50, 420, 120, 60); // Coperta
        ctx.fillStyle = "#bbdefb"; ctx.fillRect(50, 420, 30, 60);  // Cuscino
        // Finestra con luce
        ctx.fillStyle = "#81d4fa"; ctx.fillRect(250, 250, 80, 100);
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.strokeRect(250, 250, 80, 100);
        // Porta d'uscita
        ctx.fillStyle = "#3e2723"; ctx.fillRect(540, 320, 60, 130);
    }

    function drawOutdoor() {
        // Strada Lucugnano
        ctx.fillStyle = "#348332"; ctx.fillRect(600, 480, 2000, 200); // Erba
        ctx.fillStyle = "#795548"; ctx.fillRect(600, 440, 2000, 60);  // Sentiero
        
        // Muretto a secco tipico salentino
        ctx.fillStyle = "#bdbdbd";
        for(let i=0; i<15; i++) {
            ctx.fillRect(650 + (i*100), 400, 80, 40);
        }
    }

    function update() {
        if (introActive || sceneState.isFinished) return;

        player.moving = keys.d || keys.arrowright || keys.a || keys.arrowleft;
        if (keys.d || keys.arrowright) player.x += player.speed;
        if (keys.a || keys.arrowleft) player.x -= player.speed;

        player.frameCounter++;
        
        // La camera segue Umberto in modo fluido
        camera.x += (player.x - canvas.width / 3 - camera.x) * camera.smooth;

        if (player.x > 1800) {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            sceneState.isFinished = true;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        drawOutdoor();
        drawHouse();
        drawChar(player);

        ctx.restore();
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