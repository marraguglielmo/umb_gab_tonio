export function startIntro(ctx, canvas) {
    const dialogueText = document.getElementById("dialogue-text");
    const btn = document.getElementById("continue-btn");
    
    const sceneState = { isFinished: false };
    const slides = [
        "2020. Il mondo si fermò, e con esso i nostri sogni più piccoli.\n\nLe luci delle feste si spensero prima di accendersi.",
        "Ci hanno tolto l'abbraccio della maturità.\n\nSiamo diventati adulti nel silenzio delle nostre stanze, senza un rullino che ne conservasse traccia.",
        "Sei anni dopo, siamo ancora qui a Tricase. Uomini con un vuoto nel petto.\n\nCercando quel video del 18esimo che non è mai stato girato.\nIl pezzo mancante della nostra storia."
    ];

    let currentSlide = 0;
    dialogueText.innerText = slides[0];

    function loop() {
        if (sceneState.isFinished) return; // Si ferma quando finisce la intro
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        requestAnimationFrame(loop);
    }
    loop();

    btn.onclick = () => {
        currentSlide++;
        if (currentSlide < slides.length) {
            dialogueText.innerText = slides[currentSlide];
        } else {
            sceneState.isFinished = true;
        }
    };

    return sceneState;
}