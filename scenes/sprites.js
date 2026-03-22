// sprites.js

/**
 * Disegna un personaggio con animazione idle/walk e gambe
 * @param {CanvasRenderingContext2D} ctx - Il contesto del canvas
 * @param {Object} p - L'oggetto personaggio (x, y, color, ecc.)
 * @param {number} glitchTimer - Opzionale, per le reazioni
 */
export function drawGlobalChar(ctx, p, glitchTimer = 0) {
    if (p.id === "cece" && p.visible === false) return;

    // --- LOGICA ANIMAZIONE GAMBE ---
    // Se il personaggio si muove (walking) o se vogliamo un respiro costante
    const speed = p.walking ? 0.015 : 0.005;
    const amplitude = p.walking ? 4 : 1;
    const walkCycle = Math.sin(Date.now() * speed) * amplitude;

    // Logica movimento fluido per Cece (o chiunque abbia un targetY)
    if (p.walking && p.targetY !== undefined) {
        if (Math.abs(p.y - p.targetY) > 2) {
            p.y += (p.y > p.targetY) ? -2.5 : 2.5;
        } else {
            p.y = p.targetY;
            p.walking = false;
        }
    }

    ctx.save();
    ctx.translate(p.x, p.y);

    const PIXEL = 2;

    // 1. OMBRA
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(16, 42, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. GAMBE (Sotto il corpo)
    ctx.fillStyle = p.colorDark || "#333";
    // Gamba SX
    ctx.fillRect(8, 34, 6, 6 + walkCycle);
    // Gamba DX
    ctx.fillRect(18, 34, 6, 6 - walkCycle);

    // 3. CORPO (Maglietta)
    ctx.fillStyle = p.color;
    ctx.fillRect(4, 14, 24, 20);

    // 4. TESTA
    ctx.fillStyle = "#efd0b1";
    ctx.fillRect(6, 0, 20, 18);

    // 5. OCCHI / OCCHIALI
    ctx.fillStyle = "#000";
    if (p.id === "cece") {
        ctx.fillRect(8, 8, 16, 3); // Occhiali
    } else {
        ctx.fillRect(10, 8, PIXEL, PIXEL);
        ctx.fillRect(20, 8, PIXEL, PIXEL);
    }

    // 6. CAPELLI (Personalizzati)
    ctx.fillStyle = p.hairColor;
    if (p.id === "umberto") {
        ctx.fillRect(6, -2, 20, 6);
        ctx.fillRect(4, 2, 2, 4);
        ctx.fillRect(26, 2, 2, 4);
    } else if (p.id === "bubi") {
        ctx.fillRect(4, -4, 24, 8);
        ctx.fillRect(2, 0, 2, 10);
        ctx.fillRect(28, 0, 2, 10);
    } else {
        ctx.fillRect(6, -2, 20, 6); // Capelli base
    }

    // 7. NOME
    ctx.fillStyle = "white";
    ctx.font = "8px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText(p.name, 16, -15);

    // 8. REAZIONI GLITCH (Se attivo)
    if (glitchTimer > 20) {
        ctx.fillStyle = "red";
        ctx.font = "10px 'Press Start 2P'";
        let msg = "";
        if (p.id === "umberto") msg = "UÉ MARONNA!";
        if (p.id === "bubi") msg = "MAMMA MIA!";
        if (p.id === "tonio") msg = "CRISTO!";
        if (p.id === "cece") msg = "AI ACTIVATED!";
        ctx.fillText(msg, 16, -45);
    }

    ctx.restore();
}