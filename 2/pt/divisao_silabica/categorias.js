const JOGO_CATEGORIAS = {
    simples: {
        nome: "Palavras Simples",
        descricao: "Ouve os sons e divide as palavras corretamente!",
        imgCapa: "icones/balao.png",
        itens: [
            { palavra: "BONECA", divisao: "BO-NE-CA", opcoes: ["BON-E-CA", "BO-NE-CA", "BONE-CA"] },
            { palavra: "PIPOCA", divisao: "PI-PO-CA", opcoes: ["PI-PO-CA", "PIP-O-CA", "PI-POC-A"] },
            { palavra: "SAPATO", divisao: "SA-PA-TO", opcoes: ["SAP-A-TO", "SA-PAT-O", "SA-PA-TO"] },
            { palavra: "CANETA", divisao: "CA-NE-TA", opcoes: ["CA-NET-A", "CA-NE-TA", "CAN-E-TA"] }
        ]
    },
    gemeos: {
        nome: "O RR e o SS",
        descricao: "Regra: O RR e o SS ficam sempre na mesma sílaba. CA-RRO!",
        imgCapa: "icones/carro.png",
        itens: [
            { palavra: "CARRO", divisao: "CA-RRO", opcoes: ["CAR-RO", "CA-RRO", "CARR-O"] },
            { palavra: "PASSO", divisao: "PA-SSO", opcoes: ["PAS-SO", "PA-SSO", "PASS-O"] },
            { palavra: "FERRO", divisao: "FE-RRO", opcoes: ["FER-RO", "FE-RRO", "FERR-O"] },
            { palavra: "MASSA", divisao: "MA-SSA", opcoes: ["MAS-SA", "MA-SSA", "MASS-A"] },
            { palavra: "PÁSSARO", divisao: "PÁ-SSA-RO", opcoes: ["PÁS-SA-RO", "PÁ-SSA-RO", "PÁSS-A-RO"] }
        ]
    },
    inseparaveis: {
        nome: "CH, LH e NH",
        descricao: "Regra: O CH, LH e NH nunca se separam! CHU-VA!",
        imgCapa: "icones/coelho.png",
        itens: [
            { palavra: "CHUVA", divisao: "CHU-VA", opcoes: ["CH-U-VA", "CHU-VA", "CHUV-A"] },
            { palavra: "COELHO", divisao: "CO-E-LHO", opcoes: ["CO-EL-HO", "CO-E-LHO", "COE-LHO"] },
            { palavra: "GALINHA", divisao: "GA-LI-NHA", opcoes: ["GA-LIN-HA", "GA-LI-NHA", "GAL-I-NHA"] },
            { palavra: "PALHAÇO", divisao: "PA-LHA-ÇO", opcoes: ["PAL-HA-ÇO", "PA-LHA-ÇO", "PA-LH-AÇO"] }
        ]
    }
};
