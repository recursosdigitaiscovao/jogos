// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  
    nomeJogo: "CONTAR SÍLABAS"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#e9f0f8",       
        corHeader: "#ffffff",       
        corContainer: "#e9f0f8",    
        corCard: "#f0f7ff",         
        bordaCard: "none",          
        sombraCard: "0 15px 35px rgba(176,196,217,0.4)",
        // ESTES CONTROLAM AS 3 TELAS (Intro, Jogo, Resultado)
        corEspacoJogo: "#ffffff",   
        bordaEspacoJogo: "3px dashed #5ba4e5",
        corPrimaria: "#5ba4e5", 
        corEscura: "#3d7db8",   
        corTexto: "#5d7082",    
        voltarMobile: "voltar_az.png" 
    },
    "matematica": { 
        corPagina: "#e8f9f4",
        corHeader: "#ffffff",
        corContainer: "#e8f9f4",
        corCard: "#f0fdfa",
        bordaCard: "none",
        sombraCard: "0 15px 35px rgba(160,210,190,0.4)",
        corEspacoJogo: "#ffffff",
        bordaEspacoJogo: "3px dashed #45cfa8",
        corPrimaria: "#45cfa8",
        corEscura: "#2BA886",
        corTexto: "#45cfa8",
        voltarMobile: "voltar_vr.png"
    },
    "estudo": { 
        corPagina: "#EAE2E5",
        corHeader: "#ffffff",
        corContainer: "#EAE2E5",
        corCard: "#f7f3f4",
        bordaCard: "none",
        sombraCard: "0 15px 35px rgba(180,160,170,0.4)",
        corEspacoJogo: "#ffffff",
        bordaEspacoJogo: "3px dashed #994D4D",
        corPrimaria: "#994D4D",
        corEscura: "#6C3737",
        corTexto: "#994D4D",
        voltarMobile: "voltar_cs.png"
    },
    "pre": { 
        corPagina: "#FFF5F7",
        corHeader: "#ffffff",
        corContainer: "#FFF5F7",
        corCard: "#fff0f3",
        bordaCard: "none",
        sombraCard: "0 15px 35px rgba(230,180,190,0.4)",
        corEspacoJogo: "#ffffff",
        bordaEspacoJogo: "3px dashed #E691A7",
        corPrimaria: "#E691A7",
        corEscura: "#D54267",
        corTexto: "#E691A7",
        voltarMobile: "voltar_rs.png"
    }
};

// ... Restante do dados.js mantém-se igual (BIBLIOTECA_CONTEUDO e JOGO_CONFIG) ...
