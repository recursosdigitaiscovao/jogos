let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

// Variáveis Three.js
let scene, camera, renderer, raycaster, mouse;
let fishes = [];
let animationId;
let targetNum = 0;
let rule = 'greater'; // 'greater' ou 'less'
let jogoAtivo = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// Injetar script Three.js dinamicamente se não existir
if (!window.THREE) {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    document.head.appendChild(script);
}

// === 1. INICIALIZAÇÃO E TUTORIAL ===
window.startLogic = function() {
    if (!categoriaAtual) categoriaAtual = "mar-calmo";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Pesca o peixe que tem o número correto para cumprir a missão do Comandante!";
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="font-size:60px; animation: swim 3s infinite ease-in-out;">🐠</div>
            <div id="tut-hand" style="font-size:40px; animation: tap 2s infinite;">☝️</div>
        </div>
        <style>
            @keyframes swim { 0%, 100% { transform: translateX(-20px) rotate(10deg); } 50% { transform: translateX(20px) rotate(-10deg); } }
            @keyframes tap { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px) scale(0.9); } }
        </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    jogoAtivo = true;
    iniciarCronometro();
    setupThreeJS();
    proximaMissao();
};

function iniciarCronometro() {
    tempoInicio = Date.now();
    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const min = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const seg = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${min}:${seg}`;
    }, 1000);
}

function setupThreeJS() {
    const container = document.getElementById('game-main-content');
    container.style.background = "linear-gradient(180deg, #bae6fd 0%, #38bdf8 100%)";
    container.innerHTML = `<div id="canvas-container" style="width:100%; height:100%; position:relative; cursor:crosshair;"></div>
                            <div id="mission-ui" style="position:absolute; top:20px; background:white; padding:10px 20px; border-radius:20px; font-weight:900; color:#0369a1; border:3px solid #0ea5e9; box-shadow:0 5px 15px rgba(0,0,0,0.1); z-index:10;"></div>
                            <div id="labels-layer" style="position:absolute; inset:0; pointer-events:none;"></div>`;

    const canvasBox = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, canvasBox.clientWidth / canvasBox.clientHeight, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasBox.clientWidth, canvasBox.clientHeight);
    canvasBox.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    canvasBox.addEventListener('mousedown', aoClicar);
    animate();
}

function proximaMissao() {
    if (indicePergunta >= 10) { finalizar(); return; }
    
    const config = JOGO_CATEGORIAS[categoriaAtual];
    targetNum = Math.floor(Math.random() * (config.maxNum - 2)) + 2;
    rule = Math.random() > 0.5 ? 'greater' : 'less';
    
    const missionUI = document.getElementById('mission-ui');
    if(missionUI) {
        missionUI.innerHTML = `PESCA UM NÚMERO <span style="color:#ef4444">${rule === 'greater' ? 'MAIOR' : 'MENOR'}</span> QUE ${targetNum}`;
    }
}

function createFish() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const group = new THREE.Group();
    const value = Math.floor(Math.random() * config.maxNum) + 1;
    
    const colors = [0xff6b6b, 0xff9f43, 0x54a0ff, 0x1dd1a1, 0xfeca57];
    const mat = new THREE.MeshPhongMaterial({ color: colors[Math.floor(Math.random()*colors.length)] });

    // Corpo Simples
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), mat);
    body.scale.set(1.5, 0.8, 0.5);
    group.add(body);

    // Cauda
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.7, 3), mat);
    tail.position.x = -1.1;
    tail.rotation.z = Math.PI / 2;
    group.add(tail);

    const side = Math.random() > 0.5 ? 1 : -1;
    group.position.set(side * 12, (Math.random() - 0.5) * 8, 0);
    if(side === -1) group.rotation.y = Math.PI;

    // Texto (DOM Label)
    const label = document.createElement('div');
    label.style.cssText = "position:absolute; color:white; font-weight:900; font-size:24px; text-shadow:2px 2px #000; pointer-events:none; font-family:Nunito;";
    label.innerText = value;
    document.getElementById('labels-layer').appendChild(label);

    group.userData = { value, speed: (config.velocidade + Math.random() * 0.02) * -side, label };
    scene.add(group);
    fishes.push(group);
}

function aoClicar(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(fishes, true);

    if (intersects.length > 0) {
        let fish = intersects[0].object;
        while(fish.parent && !fish.userData.value) fish = fish.parent;
        
        const val = fish.userData.value;
        const acerto = rule === 'greater' ? val > targetNum : val < targetNum;

        if(acerto) {
            acertos++; somAcerto.play();
            document.getElementById('hits-val').innerText = acertos;
            indicePergunta++;
            proximaMissao();
        } else {
            erros++; somErro.play();
            document.getElementById('miss-val').innerText = erros;
        }
        removerPeixe(fish);
    }
}

function removerPeixe(fish) {
    if(fish.userData.label) fish.userData.label.remove();
    scene.remove(fish);
    fishes = fishes.filter(f => f !== fish);
}

function animate() {
    if(!jogoAtivo) return;
    animationId = requestAnimationFrame(animate);

    if(Math.random() < 0.02 && fishes.length < 6) createFish();

    const vector = new THREE.Vector3();
    const rect = renderer.domElement.getBoundingClientRect();

    fishes.forEach(fish => {
        fish.position.x += fish.userData.speed;
        
        // Update Label Pos
        fish.getWorldPosition(vector);
        vector.project(camera);
        const x = (vector.x * 0.5 + 0.5) * rect.width;
        const y = (-(vector.y * 0.5) + 0.5) * rect.height;
        fish.userData.label.style.left = `${x}px`;
        fish.userData.label.style.top = `${y}px`;

        if(Math.abs(fish.position.x) > 15) removerPeixe(fish);
    });

    renderer.render(scene, camera);
}

function finalizar() {
    jogoAtivo = false;
    cancelAnimationFrame(animationId);
    clearInterval(intervaloTempo);
    somVitoria.play();

    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 

    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:10px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:25%; min-height:90px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:10px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:15px; padding:12px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:15px; padding:12px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:13px; border-radius:20px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Escolher outro jogo</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
