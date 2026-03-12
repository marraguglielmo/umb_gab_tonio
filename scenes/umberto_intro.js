export function startUmbertoIntro(ctx, canvas) {

  const dialogueText = document.getElementById("dialogue-text");
  const btn = document.getElementById("continue-btn");

  // --- UI STYLE (RPG / Pokémon‑like) ---
  if (dialogueText) {
    dialogueText.style.fontFamily = "monospace";
    dialogueText.style.fontSize = "18px";
    dialogueText.style.color = "#1a1a1a";
    dialogueText.style.lineHeight = "1.4";
  }

  if (btn) {
    btn.style.background = "#202020";
    btn.style.color = "#ffffff";
    btn.style.border = "3px solid #ffffff";
    btn.style.padding = "10px 18px";
    btn.style.fontFamily = "monospace";
    btn.style.fontSize = "14px";
    btn.style.cursor = "pointer";
    btn.style.marginTop = "10px";
    btn.style.borderRadius = "6px";
    btn.style.boxShadow = "0 4px 0 #000";

    btn.onmouseenter = () => {
      btn.style.background = "#444";
    };

    btn.onmouseleave = () => {
      btn.style.background = "#202020";
    };
  }

  const MAP_WIDTH = 1600;
  const MAP_HEIGHT = 1200;

  // --- TILEMAP SYSTEM ---
  const TILE_SIZE = 40;
  const MAP_COLS = MAP_WIDTH / TILE_SIZE;
  const MAP_ROWS = MAP_HEIGHT / TILE_SIZE;

  // tile types: 0 grass1, 1 grass2, 2 asphalt, 3 dirtRoad, 4 oliveTree
  const tileMap = [];

  for (let r = 0; r < MAP_ROWS; r++) {
    const row = [];
    for (let c = 0; c < MAP_COLS; c++) {
      // default grass pattern
      let tile = (r + c) % 2;

      // --- MTB countryside road ---

      // vertical road leaving Umberto's house (dirt MTB road)
      if (c === 6 && r >= 3 && r <= 18) {
        tile = 3;
      }

      // countryside horizontal road
      if (r === 18 && c >= 6 && c <= 20) {
        tile = 3;
      }

      // vertical road approaching the school (asphalt near town)
      if (c === 20 && r >= 5 && r <= 18) {
        tile = 2;
      }

      // scatter olive trees in countryside
      if (tile < 2 && Math.random() < 0.03 && r > 8 && r < 25) {
        tile = 4;
      }

      row.push(tile);
    }
    tileMap.push(row);
  }

  const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    w: canvas.clientWidth,
    h: canvas.clientHeight,
    smooth: 0.08
  };

  window.addEventListener("resize", () => {
    camera.w = canvas.clientWidth;
    camera.h = canvas.clientHeight;
  });

  const player = {
    x: 224,
    y: 322,
    w: 32,
    h: 42,
    speed: 3.5,
    color: "#1a2a40",
    hair: "#444",
    frame: 0,
    frameTick: 0,
    moving: false
  };

  let introActive = true;
  let introCompleted = false;
  let introCamera = {
    x: 120,
    y: 40
  };

  const keys = {
    w:false, a:false, s:false, d:false,
    arrowup:false, arrowdown:false, arrowleft:false, arrowright:false,
    shift:false
  };

  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();

    if(k in keys) keys[k] = true;

    // normalize arrow keys
    if(e.key === "ArrowUp") keys.arrowup = true;
    if(e.key === "ArrowDown") keys.arrowdown = true;
    if(e.key === "ArrowLeft") keys.arrowleft = true;
    if(e.key === "ArrowRight") keys.arrowright = true;
  });

  document.addEventListener("keyup", e => {
    const k = e.key.toLowerCase();

    if(k in keys) keys[k] = false;

    if(e.key === "ArrowUp") keys.arrowup = false;
    if(e.key === "ArrowDown") keys.arrowdown = false;
    if(e.key === "ArrowLeft") keys.arrowleft = false;
    if(e.key === "ArrowRight") keys.arrowright = false;
  });

  const roads = [
    { x:0, y:450, w:MAP_WIDTH, h:100 },
    { x:700, y:0, w:120, h:MAP_HEIGHT }
  ]; // (not used for drawing anymore)

  const buildings = [
    { x:200, y:120, w:300, h:200, label:"Casa Umberto", color:"#5d3b2a" },
    { x:950, y:120, w:280, h:200, label:"Bar", color:"#7a2d2d" },
    { x:1200, y:650, w:300, h:220, label:"Stadio", color:"#2b3d52" },
    { x:700, y:900, w:250, h:180, label:"Ecotekne", color:"#3e4a59" }
  ];

  // --- WORLD ZONES ---
  const zones = [
    { name: "Lucugnano", x:0, y:0, w:800, h:600 },
    { name: "Campagna", x:0, y:600, w:1600, h:400 },
    { name: "Tricase", x:800, y:0, w:800, h:600 }
  ];

  const school = {
    x:720,
    y:60,
    w:220,
    h:160,
    label:"Liceo Stampacchia"
  };

  const npcs = [
    { id:1, name:"Secchione", text:"Hai studiato latino?", x:750, y:260, vx:0, vy:0, timer:0 },
    { id:2, name:"Altro secchione", text:"Hai fatto la versione?", x:820, y:260, vx:0, vy:0, timer:0 },
    { id:3, name:"Super secchione", text:"Tacito è facilissimo", x:690, y:260, vx:0, vy:0, timer:0 }
  ];

  // --- HUD / MISSION ---
  let missionText = "Vai allo Stampacchia";
  let locationLabel = "Lucugnano";
  let arrivalTriggered = false;

  let cutsceneTimer = 0;

  // --- rain particles ---
  const rain = [];
  for (let i = 0; i < 120; i++) {
    rain.push({
      x: Math.random() * MAP_WIDTH,
      y: Math.random() * MAP_HEIGHT,
      v: 6 + Math.random() * 4
    });
  }

  let gameState = "PLAY";
  let currentDialog = null;
  let dialogChars = 0;

  const intro = [
    "Lucugnano, 2015.",
    "Umberto si sveglia.",
    "Primo giorno allo Stampacchia.",
    "Raggiungi la scuola."
  ];

  let introIndex = 0;

  dialogueText.innerText = intro[introIndex];

  btn.onclick = () => {

    introIndex++;

    if(introIndex < intro.length){
      dialogueText.innerText = intro[introIndex];
    }else{
      btn.style.display="none";
      dialogueText.innerText="Usa WASD per muoverti. Umberto parte da casa verso lo Stampacchia.";
      introActive = false;
      introCompleted = true;
    }

  };

  function checkCollision(nx, ny){

    if(nx < 0 || ny < 0 || nx + player.w > MAP_WIDTH || ny + player.h > MAP_HEIGHT) return true;

    for(const b of buildings){
      if(nx < b.x + b.w && nx + player.w > b.x && ny < b.y + b.h && ny + player.h > b.y){
        return true;
      }
    }

    // safe spawn strip in front of Casa Umberto door
    if(nx > 220 && nx < 290 && ny > 315 && ny < 360){
      return false;
    }

    return false;

  }

  function handleInteraction(){

    if(gameState === "DIALOG"){
      gameState = "PLAY";
      currentDialog = null;
      return;
    }

    for(const n of npcs){

      const dist = Math.hypot(player.x - n.x, player.y - n.y);

      if(dist < 70){

        currentDialog = n;
        dialogChars = 0;
        gameState = "DIALOG";

        break;

      }

    }

  }

  window.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();

    if(k === " " || k === "z" || k === "e"){
      e.preventDefault();
      handleInteraction();
    }
  });

  function update(){

    if(introActive){
      camera.x += (introCamera.x - camera.x) * 0.08;
      camera.y += (introCamera.y - camera.y) * 0.08;
      return;
    }

    if(gameState === "CUTSCENE"){
      cutsceneTimer--;
      if(cutsceneTimer <= 0){
        gameState = "PLAY";
      }
    }

    if(gameState === "PLAY"){

      let dx=0, dy=0;

      player.moving = false;

      if(keys.w || keys.arrowup) dy -= player.speed;
      if(keys.s || keys.arrowdown) dy += player.speed;
      if(keys.a || keys.arrowleft) dx -= player.speed;
      if(keys.d || keys.arrowright) dx += player.speed;

      if(dx!==0 || dy!==0){

        player.moving = true;

        if(!checkCollision(player.x+dx, player.y)) player.x += dx;
        if(!checkCollision(player.x, player.y+dy)) player.y += dy;

      }

      if(player.moving){
        player.frameTick++;
        if(player.frameTick > 8){
          player.frame = (player.frame + 1) % 2;
          player.frameTick = 0;
        }
      }

      camera.targetX = Math.max(0, Math.min(player.x - camera.w/2, MAP_WIDTH - camera.w));
      camera.targetY = Math.max(0, Math.min(player.y - camera.h/2, MAP_HEIGHT - camera.h));

      camera.x += (camera.targetX - camera.x) * camera.smooth;
      camera.y += (camera.targetY - camera.y) * camera.smooth;

      // --- NPC AI wandering / interaction awareness ---
      npcs.forEach(n => {

        const dist = Math.hypot(player.x - n.x, player.y - n.y);

        // if player is close, NPC stops and "faces" player
        if(dist < 80){
          n.vx = 0;
          n.vy = 0;

          // simple facing logic (move eyes toward player slightly)
          n.lookX = player.x;
          n.lookY = player.y;

        } else {

          n.timer--;

          if(n.timer <= 0){
            n.vx = (Math.random()*2-1) * 0.5;
            n.vy = (Math.random()*2-1) * 0.5;
            n.timer = 120 + Math.random()*120;
          }

          n.x += n.vx;
          n.y += n.vy;

        }

      });

      // update rain
      rain.forEach(r => {
        r.y += r.v;
        if (r.y > MAP_HEIGHT) r.y = -10;
      });

      // arrival trigger near school
      if (!arrivalTriggered) {
        const distSchool = Math.hypot(player.x - school.x, player.y - school.y);
        if (distSchool < 120) {
          arrivalTriggered = true;
          gameState = "CUTSCENE";
          cutsceneTimer = 180;
          locationLabel = "Stampacchia";
          missionText = "Parla con i secchioni";
        }
      }

      // --- zone detection ---
      zones.forEach(z => {
        if(player.x > z.x && player.x < z.x+z.w && player.y > z.y && player.y < z.y+z.h){
          locationLabel = z.name;
        }
      });

    }

    if(gameState === "DIALOG" && currentDialog){
      if(dialogChars < currentDialog.text.length) dialogChars += 0.6;
    }

  }

  function drawChar(x,y,color,isPlayer=false){

    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(x+16,y+40,12,4,0,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=color;
    ctx.fillRect(x+4,y+12,24,22);

    ctx.fillStyle="#efd0b1";
    ctx.fillRect(x+8,y,16,16);

    ctx.fillStyle="#333";
    ctx.fillRect(x+10,y+6,3,3);
    ctx.fillRect(x+19,y+6,3,3);

    if(isPlayer && player.moving){
      const offset = player.frame === 0 ? 4 : -4;
      ctx.fillStyle="#222";
      ctx.fillRect(x+8, y+30+offset, 6, 12);
      ctx.fillRect(x+18, y+30-offset, 6, 12);
    }else{
      ctx.fillStyle="#222";
      ctx.fillRect(x+8, y+30, 6, 12);
      ctx.fillRect(x+18, y+30, 6, 12);
    }

  }

  function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.save();

    if(introActive){
      camera.x = introCamera.x;
      camera.y = introCamera.y;
    }

    ctx.translate(-camera.x,-camera.y);

    // --- draw tilemap ---
    for(let r = 0; r < MAP_ROWS; r++){
      for(let c = 0; c < MAP_COLS; c++){
        const tile = tileMap[r][c];
        if(tile === 0) ctx.fillStyle = "#3c7a3c"; // grass light
        else if(tile === 1) ctx.fillStyle = "#356f35"; // grass dark
        else if(tile === 2) ctx.fillStyle = "#3d3d3d"; // asphalt near town
        else if(tile === 3) ctx.fillStyle = "#8a5a2b"; // salento dirt road
        else if(tile === 4) ctx.fillStyle = "#2f5d2f"; // olive tree canopy
        ctx.fillRect(
          c * TILE_SIZE,
          r * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
        if(tile === 4){
          ctx.fillStyle = "#5a3a1a";
          ctx.fillRect(c * TILE_SIZE + TILE_SIZE/2 - 2, r * TILE_SIZE + TILE_SIZE/2, 4, 10);
        }
      }
    }

    buildings.forEach(b=>{

      ctx.fillStyle=b.color;
      ctx.fillRect(b.x,b.y,b.w,b.h);

      ctx.fillStyle="#fff";
      ctx.font="10px monospace";
      ctx.fillText(b.label,b.x+10,b.y+20);

    });

    // Casa Umberto door
    ctx.fillStyle = "#3b2416";
    ctx.fillRect(235, 280, 40, 40);

    ctx.fillStyle="#dedede";
    ctx.fillRect(school.x,school.y,school.w,school.h);

    ctx.fillStyle="#fff";
    ctx.fillText(school.label,school.x+10,school.y+20);

    npcs.forEach(n=>{
      drawChar(n.x,n.y,"#6a1b9a", false);
    });

    drawChar(player.x,player.y,player.color, true);

    // simple MTB bike for Umberto
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(player.x + 8, player.y + 38, 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(player.x + 24, player.y + 38, 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(player.x + 8, player.y + 38);
    ctx.lineTo(player.x + 16, player.y + 28);
    ctx.lineTo(player.x + 24, player.y + 38);
    ctx.lineTo(player.x + 18, player.y + 20);
    ctx.stroke();

    // rain effect
    ctx.strokeStyle = "rgba(200,200,255,0.25)";
    rain.forEach(r => {
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - 1, r.y + 6);
      ctx.stroke();
    });

    ctx.restore();

    // NPC proximity hint
    npcs.forEach(n => {
      const dist = Math.hypot(player.x - n.x, player.y - n.y);
      if(dist < 70 && gameState === "PLAY"){
        // dialog style hint box
        const hintW = 360;
        const hintH = 60;
        const hintX = canvas.width/2 - hintW/2;
        const hintY = canvas.height - 90;

        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fillRect(hintX, hintY, hintW, hintH);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(hintX, hintY, hintW, hintH);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.fillText("PREMI Z / E PER PARLARE", canvas.width/2, hintY + 36);
        ctx.textAlign = "left";
      }
    });

    if(gameState === "CUTSCENE"){
      ctx.fillStyle="rgba(0,0,0,0.7)";
      ctx.fillRect(0,0,canvas.width,canvas.height);

      ctx.fillStyle="#fff";
      ctx.font="32px monospace";
      ctx.textAlign="center";
      ctx.fillText("LICEO STAMPACCHIA", canvas.width/2, canvas.height/2 - 20);

      ctx.font="16px monospace";
      ctx.fillText("I secchioni sono ovunque...", canvas.width/2, canvas.height/2 + 20);

      ctx.textAlign="left";
    }

    if(introActive){
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#fff";
      ctx.font = "34px monospace";
      ctx.textAlign = "center";
      ctx.fillText("LUCUGNANO, 2015", canvas.width / 2, 90);

      ctx.font = "16px monospace";
      ctx.fillText("Casa Umberto → strada di campagna → Stampacchia", canvas.width / 2, 125);
      ctx.textAlign = "left";
    }

    // --- HUD ---
    // HUD panel
    ctx.fillStyle = "rgba(20,20,20,0.85)";
    ctx.fillRect(15, 15, 260, 70);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(15, 15, 260, 70);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(18, 18, 254, 64);

    ctx.fillStyle = "#fff";
    ctx.font = "14px monospace";
    ctx.fillText("LUOGO: " + locationLabel, 30, 40);
    ctx.fillText("MISSIONE:", 30, 60);
    ctx.fillText(missionText, 30, 80);

    if (gameState === "PLAY") {
      ctx.fillStyle = "rgba(30,30,30,0.85)";
      ctx.fillRect(canvas.width - 180, canvas.height - 50, 160, 30);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(canvas.width - 180, canvas.height - 50, 160, 30);
      ctx.fillStyle = "#fff";
      ctx.font = "12px monospace";
      ctx.fillText("Z / E = TALK", canvas.width - 165, canvas.height - 30);
    }

    if(gameState === "DIALOG" && currentDialog){

      const dialogHeight = 120;
      const dialogY = canvas.height - dialogHeight - 20;

      // classic RPG dialog box style
      ctx.fillStyle = "rgba(0,0,0,0.92)";
      ctx.fillRect(40, dialogY, canvas.width-80, dialogHeight);

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(40, dialogY, canvas.width-80, dialogHeight);

      ctx.fillStyle = "#ffffff";
      ctx.font = '12px "Press Start 2P", monospace';

      const txt = currentDialog.text.substring(0, Math.floor(dialogChars));

      ctx.fillText(currentDialog.name.toUpperCase()+":",60, dialogY + 32);

      // wrapped dialog text
      const words = txt.split(" ");
      let line = "";
      let y = dialogY + 64;

      for(let i=0;i<words.length;i++){
        const test = line + words[i] + " ";
        if(test.length > 28){
          ctx.fillText(line,60,y);
          line = words[i] + " ";
          y += 20;
        }else{
          line = test;
        }
      }
      ctx.fillText(line,60,y);
    }

  }

  function loop(){

    update();
    draw();

    requestAnimationFrame(loop);

  }

  loop();

}