<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Antónimos - Pequenos Leitores</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        :root { 
            --bg-page: #e9f0f8; --bg-header: #ffffff; --bg-container: #e9f0f8; 
            --bg-card: #ffffff; --cor-borda-card: transparent; --sombra-card: 0 15px 35px rgba(0,0,0,0.1);
            --bg-espaco-jogo: #ffffff; --borda-espaco-jogo: 3px dashed #ccc;
            --primary-blue: #5ba4e5; --primary-dark: #3d7db8; --white: #ffffff; --text-grey: #5d7082; --header-h: 70px; 
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Nunito', sans-serif; -webkit-tap-highlight-color: transparent; }
        body { background-color: var(--bg-page); height: 100dvh; width: 100vw; overflow: hidden; display: flex; flex-direction: column; opacity: 1; transition: opacity 0.15s ease-in; }
        
        header { height: var(--header-h); background: var(--bg-header); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; z-index: 2500; flex-shrink: 0; box-shadow: 0px 4px 15px rgba(0,0,0,0.05); position: relative; }
        .logo-center { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; pointer-events: none; white-space: nowrap; }
        .logo-center img { height: 45px; width: auto; }
        .logo-text h1 { font-size: 16px; color: var(--primary-blue); font-weight: 900; text-transform: uppercase; line-height: 0.9; }
        .logo-text p { font-size: 8px; color: #88a; font-weight: 700; text-transform: uppercase; }

        .hamburger-btn { font-size: 26px; color: var(--primary-blue); cursor: pointer; padding: 5px; }
        .menu-dropdown { position: absolute; top: 65px; left: 15px; display: none; flex-direction: column; gap: 6px; z-index: 3000; width: 200px; }
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 10px 15px; background: white; border-radius: 12px; box-shadow: 2px 4px 10px rgba(0,0,0,0.1); text-decoration: none; color: var(--text-grey); font-weight: 700; font-size: 0.85rem; }
        .menu-item-voltar { background: var(--primary-blue) !important; color: white !important; }

        .game-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 15px; background-color: var(--bg-container); overflow: hidden; }
        .game-card { background: var(--bg-card); width: 100%; max-width: 1000px; height: 100%; border-radius: 40px; box-shadow: var(--sombra-card); border: 4px solid var(--cor-borda-card); display: flex; flex-direction: column; padding: 15px; position: relative; overflow: hidden; }

        .screen-box { flex: 1; width: 100%; background: var(--bg-espaco-jogo); border: var(--borda-espaco-jogo); border-radius: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0; position: relative; overflow: hidden; }

        .btn-jogar-stretch { background: var(--primary-blue); color: white; border: none; border-radius: 15px; padding: 16px; font-size: 18px; font-weight: 900; cursor: pointer; box-shadow: 0 6px 0 var(--primary-dark); display: flex; justify-content: center; align-items: center; text-decoration: none; flex: 1; }
        .btn-jogar-stretch:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }

        .status-bar { display: none; width: 100%; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-shrink: 0; padding: 0 10px; }
        .badge { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px 12px; border-radius: 10px; font-weight: 900; font-size: 11px; color: white; }
        .badge-timer { background: #cbd9e6; color: var(--text-grey); }
        .badge-round { background: var(--primary-blue); }

        .rd-panel { position: fixed; bottom: -100%; left: 0; width: 100%; background: white; z-index: 4000; padding: 20px; border-radius: 25px 25px 0 0; transition: 0.4s; box-shadow: 0 -10px 30px rgba(0,0,0,0.15); max-height: 70vh; overflow-y: auto; }
        .rd-panel.active { bottom: 0; }
        #rd-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .rd-item { background: #f8f9fa; border: 1px solid #eee; border-radius: 15px; padding: 12px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; font-weight: 700; color: var(--text-grey); font-size: 0.8rem; }
        
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.2); display: none; z-index: 2000; }
        .screen { display: none; width: 100%; height: 100%; flex-direction: column; flex: 1; overflow: hidden; }
        .screen.active { display: flex !important; }

        .btn-option {
            width: 100%;
            padding: 20px;
            font-size: 24px;
            font-weight: 800;
            border-radius: 20px;
            border: 3px solid #f0f0f0;
            background: white;
            color: var(--text-grey);
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 0 #f0f0f0;
        }
        .btn-option:active { transform: translateY(2px); box-shadow: 0 2px 0 #f0f0f0; }
        
        .option-correct { background: #7ed321 !important; color: white !important; border-color: #6ab31d !important; box-shadow: 0 4px 0 #5a9618 !important; }
        .option-wrong { background: #ff5e5e !important; color: white !important; border-color: #e04d4d !important; box-shadow: 0 4px 0 #b33a3a !important; }
    </style>
</head>
<body>
    <div class="overlay" id="overlay" onclick="closeMenus()"></div>
    
    <header>
        <div class="header-left">
            <i class="fas fa-bars hamburger-btn" onclick="toggleHamburger(event)"></i>
            <div id="dropdownMenu" class="menu-dropdown"></div>
        </div>
        <div class="logo-center">
            <div style="font-size: 30px;">📖</div>
            <div class="logo-text"><h1 id="tit-l1">PEQUENOS</h1><h1 id="tit-l2">LEITORES</h1><p id="sub-tit">Português | 1º Ano</p></div>
        </div>
        <div class="header-right">
            <div style="width: 30px;"></div>
        </div>
    </header>

    <main class="game-container">
        <div class="game-card">
            <div class="status-bar" id="status-bar">
                <div class="status-group" style="display:flex; gap:8px;">
                    <div class="badge badge-timer">⏳ <span id="timer-val">00:00</span></div>
                    <div class="badge badge-round"><span id="round-val">1 / 10</span></div>
                </div>
                <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                    <div class="badge" style="background:#7ed321;">✓ <span id="hits-val">0</span></div>
                    <div class="badge" style="background:#ff5e5e;">✗ <span id="miss-val">0</span></div>
                    <div id="rd-game-btn" style="font-size: 24px; cursor: pointer;" onclick="openRDMenu(event)">⚙️</div>
                </div>
            </div>

            <section class="screen active" id="scr-intro">
                <div class="screen-box">
                    <div id="intro-animation-container" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; min-height: 0;">
                         <div style="font-size: 80px; margin-bottom: 20px;">↔️</div>
                         <h2 id="intro-title" style="color: var(--primary-blue); font-size: 28px; font-weight: 900;">Antónimos</h2>
                    </div>
                    <p id="intro-instr" style="font-weight: 800; color: var(--text-grey); text-align: center; margin-bottom: 20px; font-size: 1.1rem; width: 100%; padding: 0 20px;">Clica na palavra que significa o contrário!</p>
                    
                    <div style="display:flex; width:100%; gap:15px; align-items:center; padding: 0 20px 20px;">
                        <button class="btn-jogar-stretch" onclick="goToGame()">COMEÇAR</button>
                        <div id="rd-intro-btn" onclick="openRDMenu(event)" style="font-size: 40px; cursor:pointer;">🔘</div>
                    </div>
                </div>
            </section>

            <section class="screen" id="scr-game">
                <div class="screen-box" id="game-main-content">
                    <!-- O jogo será injetado aqui -->
                </div>
            </section>

            <section class="screen" id="scr-result"></section>
        </div>
    </main>

    <div id="rdMenu" class="rd-panel">
        <div style="width:40px; height:4px; background:#eee; border-radius:10px; margin: 0 auto 15px;" onclick="closeMenus()"></div>
        <h3 style="text-align:center; color:var(--primary-blue); margin-bottom:15px; font-weight: 900; font-size: 1.1rem;">Escolher Nível</h3>
        <div id="rd-list"></div>
    </div>

    <script>
        
        // Simulação do dados.js (inalterável conforme pedido)
        const CONFIG_MESTRE = { ano: "ano1", area: "portugues", nomeJogo: "Jogo dos Antónimos" };
        
        const JOGO_CATEGORIAS = {
            "Nível 1": { 
                nome: "Opostos Simples", 
                target: 10, 
                desafios: [
                    { pergunta: "ALTO", opcoes: ["BAIXO", "GRANDE", "MAGRO"], resposta: "BAIXO", icon: "📏" },
                    { pergunta: "QUENTE", opcoes: ["FRIO", "DOCE", "MORNO"], resposta: "FRIO", icon: "🔥" },
                    { pergunta: "ABERTO", opcoes: ["FECHADO", "LONGE", "LIMPO"], resposta: "FECHADO", icon: "🚪" },
                    { pergunta: "DIA", opcoes: ["NOITE", "SOL", "TARDE"], resposta: "NOITE", icon: "☀️" },
                    { pergunta: "DENTRO", opcoes: ["FORA", "BAIXO", "EM CIMA"], resposta: "FORA", icon: "📦" },
                    { pergunta: "ALEGRE", opcoes: ["TRISTE", "CALMO", "FORTE"], resposta: "TRISTE", icon: "😊" },
                    { pergunta: "GRANDE", opcoes: ["PEQUENO", "ALTO", "LARGO"], resposta: "PEQUENO", icon: "🐘" },
                    { pergunta: "LIMPO", opcoes: ["SUJO", "NOVO", "BOM"], resposta: "SUJO", icon: "✨" },
                    { pergunta: "RÁPIDO", opcoes: ["LENTO", "FORTE", "MAGRO"], resposta: "LENTO", icon: "🏃" },
                    { pergunta: "BONITO", opcoes: ["FEIO", "VELHO", "MAU"], resposta: "FEIO", icon: "🌸" }
                ],
                imgCapa: "🌟" 
            },
            "Nível 2": { 
                nome: "Mais Opostos!", 
                target: 10, 
                desafios: [
                    { pergunta: "PESADO", opcoes: ["LEVE", "CURTO", "FRACO"], resposta: "LEVE", icon: "⚖️" },
                    { pergunta: "CHEIO", opcoes: ["VAZIO", "POUCO", "MEIO"], resposta: "VAZIO", icon: "🥛" },
                    { pergunta: "CLARO", opcoes: ["ESCURO", "BRANCO", "COLORIDO"], resposta: "ESCURO", icon: "💡" },
                    { pergunta: "COMPRIDO", opcoes: ["CURTO", "PEQUENO", "ESTREITO"], resposta: "CURTO", icon: "🐍" },
                    { pergunta: "MOLE", opcoes: ["DURO", "FLEXÍVEL", "DOCE"], resposta: "DURO", icon: "☁️" },
                    { pergunta: "NOVO", opcoes: ["VELHO", "USADO", "RECENTE"], resposta: "VELHO", icon: "🆕" },
                    { pergunta: "FÁCIL", opcoes: ["DIFÍCIL", "SIMPLES", "LENTO"], resposta: "DIFÍCIL", icon: "🧩" },
                    { pergunta: "SECO", opcoes: ["MOLHADO", "FRIO", "GELADO"], resposta: "MOLHADO", icon: "⛱️" },
                    { pergunta: "FORTE", opcoes: ["FRACO", "GRANDE", "DURO"], resposta: "FRACO", icon: "💪" },
                    { pergunta: "DOCE", opcoes: ["AMARGO", "SALGADO", "BOM"], resposta: "AMARGO", icon: "🍭" }
                ],
                imgCapa: "🚀"
            }
        };

        const JOGO_CONFIG = {
            linkVoltar: "#",
            textoVoltar: "VOLTAR",
            sons: {
                acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
                erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
                vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
            },
            categorias: JOGO_CATEGORIAS,
            relatorios: [
                { min: 90, max: 100, titulo: "És um craque!", img: "🏆" },
                { min: 70, max: 89, titulo: "Muito bem!", img: "🥈" },
                { min: 50, max: 69, titulo: "Estás quase lá!", img: "🥉" },
                { min: 0, max: 49, titulo: "Continua a tentar!", img: "💪" }
            ]
        };

        let categoriaAtual = "Nível 1";
        let indiceDesafio = 0;
        let acertos = 0;
        let erros = 0;
        let tempoInicio;
        let intervaloTempo;
        let jogoAtivo = false;

        function initUI() {
            const rdBox = document.getElementById('rd-list');
            rdBox.innerHTML = '';
            Object.keys(JOGO_CONFIG.categorias).forEach(key => {
                const c = JOGO_CONFIG.categorias[key];
                const div = document.createElement('div');
                div.className = 'rd-item';
                div.innerHTML = `<span style="font-size:30px">${c.imgCapa}</span><span>${c.nome}</span>`;
                div.onclick = () => { selecionarCategoria(key); closeMenus(); goToIntro(); };
                rdBox.appendChild(div);
            });
            startLogic();
        }

        function startLogic() {
            const config = JOGO_CONFIG.categorias[categoriaAtual];
            document.getElementById('intro-title').innerText = config.nome;
            document.getElementById('hits-val').innerText = "0";
            document.getElementById('miss-val').innerText = "0";
            document.getElementById('timer-val').innerText = "00:00";
        }

        function selecionarCategoria(id) { categoriaAtual = id; }

        function initGame() {
            acertos = 0; erros = 0; indiceDesafio = 0; jogoAtivo = true;
            iniciarCronometro();
            proximoDesafio();
        }

        function iniciarCronometro() {
            if(intervaloTempo) clearInterval(intervaloTempo);
            tempoInicio = Date.now();
            intervaloTempo = setInterval(() => {
                const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
                const mins = Math.floor(decorrido / 60).toString().padStart(2, '0');
                const segs = (decorrido % 60).toString().padStart(2, '0');
                document.getElementById('timer-val').innerText = `${mins}:${segs}`;
            }, 1000);
        }

        function proximoDesafio() {
            const gameBox = document.getElementById('game-main-content');
            const lista = JOGO_CONFIG.categorias[categoriaAtual].desafios;
            
            if (indiceDesafio >= lista.length) {
                finalizarJogo();
                return;
            }

            const dados = lista[indiceDesafio];
            document.getElementById('round-val').innerText = `${indiceDesafio + 1} / ${lista.length}`;

            gameBox.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px; padding: 20px;">
                    <div style="background: #f8fbff; padding: 30px; border-radius: 25px; width: 100%; text-align:center; border: 3px solid var(--primary-blue); position:relative;">
                        <div style="font-size: 60px; margin-bottom: 10px;">${dados.icon}</div>
                        <div style="font-size: 40px; font-weight: 900; color: var(--primary-dark); letter-spacing: 2px;">${dados.pergunta}</div>
                        <div style="color: #88a; font-weight: 800; margin-top: 10px; font-size: 14px;">QUAL É O ANTÓNIMO?</div>
                    </div>
                    
                    <div id="options-grid" style="display:grid; grid-template-columns: 1fr; gap: 15px; width: 100%;">
                        ${dados.opcoes.map(opt => `
                            <button class="btn-option" onclick="verificarResposta('${opt}')">${opt}</button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function verificarResposta(escolha) {
            if (!jogoAtivo) return;
            jogoAtivo = false;

            const dados = JOGO_CONFIG.categorias[categoriaAtual].desafios[indiceDesafio];
            const botoes = document.querySelectorAll('.btn-option');
            
            let correto = (escolha === dados.resposta);

            botoes.forEach(btn => {
                if(btn.innerText.trim() === dados.resposta) btn.classList.add('option-correct');
                if(btn.innerText.trim() === escolha && !correto) btn.classList.add('option-wrong');
            });

            if (correto) {
                acertos++;
                tocarSom('acerto');
            } else {
                erros++;
                tocarSom('erro');
            }

            document.getElementById('hits-val').innerText = acertos;
            document.getElementById('miss-val').innerText = erros;

            setTimeout(() => {
                indiceDesafio++;
                jogoAtivo = true;
                proximoDesafio();
            }, 1800);
        }

        function finalizarJogo() {
            clearInterval(intervaloTempo);
            tocarSom('vitoria');
            
            const total = JOGO_CONFIG.categorias[categoriaAtual].desafios.length;
            const percentagem = Math.round((acertos / total) * 100);
            let rel = JOGO_CONFIG.relatorios.find(r => percentagem >= r.min && percentagem <= r.max);
            
            const scrResult = document.getElementById('scr-result');
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            scrResult.classList.add('active');
            document.getElementById('status-bar').style.display = 'none';

            scrResult.innerHTML = `
                <div class="screen-box" style="padding: 40px; text-align:center;">
                    <div style="font-size: 100px; margin-bottom: 20px;">${rel.img}</div>
                    <h2 style="font-size: 32px; color: var(--primary-blue); font-weight: 900;">${rel.titulo}</h2>
                    <p style="font-size: 20px; color: var(--text-grey); margin: 20px 0;">Acertaste <b>${acertos}</b> de ${total} desafios!</p>
                    
                    <div style="display:flex; gap:15px; width:100%; margin-top: 20px;">
                        <button class="btn-jogar-stretch" onclick="goToIntro()">REPETIR</button>
                        <button class="btn-jogar-stretch" style="background:#88a; box-shadow: 0 6px 0 #668;" onclick="location.reload()">SAIR</button>
                    </div>
                </div>
            `;
        }

        function tocarSom(tipo) {
            const audio = new Audio(JOGO_CONFIG.sons[tipo]);
            audio.play().catch(() => {});
        }

        function toggleHamburger(e) { e.stopPropagation(); const m = document.getElementById('dropdownMenu'); const ov = document.getElementById('overlay'); const isOpen = m.style.display === 'flex'; m.style.display = isOpen ? 'none' : 'flex'; ov.style.display = isOpen ? 'none' : 'block'; }
        function openRDMenu(e) { if(e) e.stopPropagation(); document.getElementById('rdMenu').classList.add('active'); document.getElementById('overlay').style.display = 'block'; }
        function closeMenus() { document.getElementById('dropdownMenu').style.display = 'none'; document.getElementById('rdMenu').classList.remove('active'); document.getElementById('overlay').style.display = 'none'; }
        
        function goToIntro() { 
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); 
            document.getElementById('scr-intro').classList.add('active'); 
            document.getElementById('status-bar').style.display = 'none'; 
            startLogic(); 
        }
        
        function goToGame() { 
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); 
            document.getElementById('scr-game').classList.add('active'); 
            document.getElementById('status-bar').style.display = 'flex'; 
            initGame(); 
        }

        window.onload = initUI;
    </script>
</body>
</html>
