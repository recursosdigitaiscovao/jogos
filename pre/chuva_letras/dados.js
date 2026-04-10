<audio id="sound-win" src="../../sounds/acerto.mp3"></audio>
<audio id="sound-lose" src="../../sounds/erro.mp3"></audio>

<div class="overlay" id="overlay" onclick="closeMenus()"></div>

<div class="sidebar" id="sidebar">
    <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold; color: var(--cor-principal);">MENU</span>
        <button onclick="toggleMenu()" style="border:none; background:none; cursor:pointer;">✕</button>
    </div>
    <a href="/jogos/" class="sidebar-item">🏠 Início</a>
    <a href="/jogos/pre" class="sidebar-item"><img id="side-pre" src=""> Pré-Escolar</a>
    <a href="/jogos/1" class="sidebar-item"><img id="side-1" src=""> 1º Ano</a>
    <a href="/jogos/2" class="sidebar-item"><img id="side-2" src=""> 2º Ano</a>
    <a href="/jogos/3" class="sidebar-item"><img id="side-3" src=""> 3º Ano</a>
    <a href="/jogos/4" class="sidebar-item"><img id="side-4" src=""> 4º Ano</a>
</div>

<div class="sidebar-rd" id="sidebar-rd">
    <h3 style="margin:0 0 15px 0; color:var(--cor-principal);">Escolhe o Grupo</h3>
    <div id="categorias-list" style="max-height: 220px; overflow-y: auto;"></div>
</div>

<header class="nav-bar">
    <button onclick="toggleMenu()" style="background:none; border:none; font-size:26px; color:var(--cor-principal); cursor:pointer;">☰</button>
    <h1 style="display:flex; align-items:center; gap:10px; font-size:1.1rem; color:var(--cor-principal); margin: 0;">
        <img id="header-icon" src="" style="height:32px;"> Pré-Escolar
    </h1>
    <a href="../" class="back-btn">⬅ Voltar</a>
</header>

<main class="main-content">
    <section id="intro-screen" class="screen active">
        <div class="game-card help-card">
            <div class="explanation-box">
                <p style="color:var(--cor-texto); font-weight:bold; font-size: 1.2rem; margin-bottom: 20px;">Clica na tecla da letra que está a cair!</p>
                <div class="anim-pula" id="preview-letter" style="font-size: 5rem; font-weight: bold; color: var(--cor-principal); text-shadow: 2px 2px 0 white;">a</div>
            </div>
            <h2 style="color:var(--cor-principal); text-align:center; font-size:1.4rem; margin:10px 0; font-weight:bold;">Chuva de Letras</h2>
            <div style="display:flex; gap:10px; width:100%;">
                <button class="btn-play" onclick="startGame()">JOGAR</button>
                <button class="btn-rd" onclick="toggleRD()"><img id="btn-rd-icon" src="" style="width:35px;"></button>
            </div>
        </div>
    </section>

    <section id="game-screen" class="screen">
        <div class="game-card">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:5px 10px; font-size:0.9rem; flex-shrink: 0;">
                <div>⏳ <span id="timer">00:00</span></div>
                <div id="stars-bar" style="display:flex; gap:4px;"></div>
                <div style="display:flex; align-items:center;">
                    PTS: <span id="points">0</span>
                    <button class="btn-rd-mini" onclick="toggleRD()"><img id="rd-mini-icon" src=""></button>
                </div>
            </div>
            <div class="rain-area" id="rain-container"></div>
            <div class="keyboard" id="virtual-keyboard"></div>
        </div>
    </section>
</main>

<div class="modal" id="modal">
    <div class="modal-content">
        <h2 id="modal-title" style="color:var(--cor-acerto);">Parabéns!</h2>
        <div id="modal-msg" style="margin: 20px 0;"></div>
        <button class="btn-play" onclick="location.reload()" style="background:var(--cor-principal);">Jogar de Novo</button>
    </div>
</div>

<script src="dados.js"></script>
<script>
    let currentLevel = 1, points = 0, seconds = 0, timerInterval;
    let catKey = "vogais_min", fallingItems = [];
    let gameActive = false, spawnTimeout;

    window.onload = () => {
        const p = JOGO_CONFIG.caminhoIcons;
        document.getElementById('header-icon').src = p + JOGO_CONFIG.iconesMenu.pre;
        ['side-pre','side-1','side-2','side-3','side-4'].forEach((id, i) => {
            const icon = i === 0 ? 'pre' : `ano${i}`;
            const el = document.getElementById(id); if(el) el.src = p + JOGO_CONFIG.iconesMenu[icon];
        });
        document.getElementById('btn-rd-icon').src = JOGO_CONFIG.caminhoImg + "rd.png";
        document.getElementById('rd-mini-icon').src = JOGO_CONFIG.caminhoImg + "rd.png";
        setupRDMenu();
        updatePreview();
    };

    function setupKeyboard() {
        const kb = document.getElementById('virtual-keyboard');
        const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
        const isMin = JOGO_CONFIG.letras.categorias[catKey].modo === "min";
        kb.innerHTML = '';
        rows.forEach(row => {
            const div = document.createElement('div');
            div.className = 'kb-row';
            row.split('').forEach(char => {
                const finalChar = isMin ? char.toLowerCase() : char.toUpperCase();
                const key = document.createElement('div');
                key.className = 'key'; key.innerText = finalChar;
                key.onclick = () => handleInput(finalChar);
                div.appendChild(key);
            });
            kb.appendChild(div);
        });
    }

    function setupRDMenu() {
        const list = document.getElementById('categorias-list');
        const path = JOGO_CONFIG.letras.caminho;
        Object.keys(JOGO_CONFIG.letras.categorias).forEach(k => {
            const cat = JOGO_CONFIG.letras.categorias[k];
            const item = document.createElement('div');
            item.className = 'sidebar-item';
            item.innerHTML = `<img src="${path + cat.img}"> ${cat.nome}`;
            item.onclick = () => { catKey = k; updatePreview(); closeMenus(); if(gameActive) resetGame(); };
            list.appendChild(item);
        });
    }

    function updatePreview() {
        const cat = JOGO_CONFIG.letras.categorias[catKey];
        document.getElementById('preview-letter').innerText = cat.lista[0];
    }

    function resetGame() {
        gameActive = false;
        clearTimeout(spawnTimeout);
        clearInterval(timerInterval);
        fallingItems.forEach(i => i.el.remove());
        fallingItems = [];
        currentLevel = 1; points = 0; seconds = 0;
        document.getElementById('points').innerText = "0";
        document.getElementById('timer').innerText = "00:00";
        startGame();
    }

    function startGame() {
        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        setupKeyboard();
        gameActive = true;
        initStars();
        timerInterval = setInterval(() => {
            seconds++;
            document.getElementById('timer').innerText = `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
        }, 1000);
        spawnLoop();
        requestAnimationFrame(fallLoop);
    }

    function initStars() {
        const bar = document.getElementById('stars-bar'); bar.innerHTML = '';
        for(let i=0; i<5; i++) {
            let s = document.createElement('div');
            s.style.cssText="width:18px;height:18px;border:2px solid #ccc;border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold; color:white;";
            bar.appendChild(s);
        }
    }

    function spawnLoop() {
        if(!gameActive) return;
        const pool = JOGO_CONFIG.letras.categorias[catKey].lista;
        const char = pool[Math.floor(Math.random() * pool.length)];
        const container = document.getElementById('rain-container');
        const el = document.createElement('div');
        el.className = 'falling-letter'; el.innerText = char;
        el.style.left = Math.random() * (container.clientWidth - 50) + 10 + 'px';
        el.style.top = '-60px';
        container.appendChild(el);
        fallingItems.push({ el, char, y: -60 });
        
        // Intervalo de queda lento (2s a 4.5s)
        spawnTimeout = setTimeout(spawnLoop, Math.max(2000, 4500 - (currentLevel * 400)));
    }

    function fallLoop() {
        if(!gameActive) return;
        const containerHeight = document.getElementById('rain-container').clientHeight;
        // Velocidade muito lenta (0.35 base)
        const speed = 0.35 + (currentLevel * 0.15);

        for (let i = fallingItems.length - 1; i >= 0; i--) {
            let item = fallingItems[i];
            item.y += speed;
            item.el.style.top = item.y + 'px';

            if (item.y > containerHeight) {
                item.el.remove();
                fallingItems.splice(i, 1);
                handleResult(false);
            }
        }
        requestAnimationFrame(fallLoop);
    }

    function handleInput(char) {
        if(!gameActive) return;
        let lowestIdx = -1, maxY = -100;
        fallingItems.forEach((item, idx) => {
            if(item.char === char && item.y > maxY) {
                maxY = item.y; lowestIdx = idx;
            }
        });

        if(lowestIdx !== -1) {
            fallingItems[lowestIdx].el.remove();
            fallingItems.splice(lowestIdx, 1);
            handleResult(true);
        }
    }

    function handleResult(success) {
        const stars = document.getElementById('stars-bar').children;
        const star = stars[currentLevel - 1];

        if(success) {
            points += 10;
            document.getElementById('sound-win').play().catch(()=>{});
            star.style.background = "var(--cor-acerto)";
            star.style.borderColor = "var(--cor-acerto)";
            star.innerText = "✔";
        } else {
            if(points > 0) points -= 2;
            document.getElementById('sound-lose').play().catch(()=>{});
            star.style.background = "var(--cor-erro)";
            star.style.borderColor = "var(--cor-erro)";
            star.innerText = "✖";
        }
        document.getElementById('points').innerText = points;

        if(currentLevel < 5) currentLevel++;
        else endGame();
    }

    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        document.getElementById('modal-msg').innerHTML = `<p>Pontos: ${points}</p><p>Tempo: ${document.getElementById('timer').innerText}</p>`;
        document.getElementById('modal').style.display = 'flex';
    }

    window.onkeydown = (e) => handleInput(e.key);
    function toggleMenu() { document.getElementById('sidebar').classList.toggle('active'); document.getElementById('overlay').classList.toggle('active'); }
    function toggleRD() { document.getElementById('sidebar-rd').classList.toggle('active'); document.getElementById('overlay').classList.toggle('active'); }
    function closeMenus() { document.getElementById('sidebar').classList.remove('active'); document.getElementById('sidebar-rd').classList.remove('active'); document.getElementById('overlay').classList.remove('active'); }
</script>
