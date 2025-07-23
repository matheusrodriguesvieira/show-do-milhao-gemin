"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function HoverButton({ children, style, ...props }) {
  const [isHovered, setIsHovered] = useState(false);

  const baseButtonStyle = {
    padding: "12px 25px",
    fontSize: "1.1em",
    fontWeight: "bold",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "all 0.3s ease-in-out", // Adicionei 'all' e 'ease-in-out' para melhor prática
    cursor: "pointer",
    boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 10px",
    color: "white",
    ...style,
  };

  const hover = {
    transform: "scale(1.05)",
  };

  return (
    <button
      style={
        isHovered ? { ...baseButtonStyle, ...hover } : { ...baseButtonStyle }
      }
      // onMouseEnter={() => console.log(children)}
      // onMouseEnter={() => console.log(baseButtonStyle)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props} // Passa quaisquer outras props para o botão
    >
      {children}
    </button>
  );
}

// --- ESTILOS CENTRALIZADOS E OTIMIZADOS ---
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontFamily: "Arial, sans-serif",
  background: "linear-gradient(135deg, #1d3c7cff, #081b44ff)",
  color: "#edf2f7",
  textAlign: "center",
  padding: "20px",
  boxSizing: "border-box",
};

const logoStyle = {
  width: "200px", // Ajuste o tamanho do logo
  height: "auto",
  marginBottom: "30px",
  filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))",
};

const titleStyle = {
  fontSize: "2em",
  marginBottom: "30px",
};

const primaryButtonStyle = {
  backgroundColor: "#4CAF50",
  border: "2px solid #4CAF50",
};
const secondaryButtonStyle = {
  backgroundColor: "#e53e3e",
  border: "2px solid #e53e3e",
};


const cardContainer = {
  display:'flex',
  flexDirection:'column',
  minWidth: "30%",
  backgroundColor: "rgba(45, 55, 72, 0.5)",
  // backgroundColor: "red",
  borderRadius: "10px",
  padding: "30px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
  marginBottom: "20px",
  alignItems:'center',
  // justifyContent: 'center'
};

const inputsContainer = {
  display: "flex",
  // justifyContent:"space-evenly",
  alignItems: "center",
  height:'70%',
  width:"100%",
  gap: '20%',
  // backgroundColor:'red'
};

const inputGroupContainer = {
  display:'flex',
  flexDirection:'column',
  alignItems: 'start'
};

const labelStyle = {
  fontSize: "0.8rem",
  textTransform:'uppercase', 
  marginBottom: "-2px",
  display: "block",
  fontWeight: "bold",
};

const inputStyle = {
  padding: "10px 15px",
  fontSize: "1em",
  borderRadius: "5px",
  border: "2px solid #4a5568",
  backgroundColor: "#2d3748",
  color: "#edf2f7",
  width: "calc(125%)",
  maxWidth: "300px",
  // marginBottom: "15px",
  textAlign: "center",
};

const numberInput = {
  padding: "10px",
  fontSize: "1em",
  borderRadius: "5px",
  border: "2px solid #4a5568",
  backgroundColor: "#2d3748",
  color: "#edf2f7",
  width: "80px",
  textAlign: "center",
  // textDecoration: 'none'
};

const buttonsContainer = {
  display: "flex",
  // gap: "20px",
  marginTop: "30px",
  width: '100%',
  // backgroundColor: 'red',
  justifyContent: 'space-between',
};

export default function ConfiguracoesPage() {
  const [numRodadas, setNumRodadas] = useState(3);
  const [nomeJogador, setNomeJogador] = useState("");

  const router = useRouter();

  function handleProsseguir() {
    if (nomeJogador.trim() === "") {
      alert("Por favor, insira o seu nome.");
      return;
    }
    if (numRodadas < 1) {
      alert("O número de rodadas deve ser no mínimo 1.");
      setNumRodadas(1);
      return;
    }

    const config = {
      rodadas: numRodadas,
      nomesJogadores: nomeJogador.trim(),
    };

    sessionStorage.setItem("gameConfig", JSON.stringify(config));
    router.push("/perguntas");
  }

  function handleVoltar() {
    router.push("/");
  }

  return (
    <div style={containerStyle}>
      <img src="/assets/images/logo.png" alt="Logo do Jogo" style={logoStyle} />

      <h2 style={titleStyle}>Configurar Jogo</h2>

      <div style={cardContainer}>
        <div style={inputsContainer}>
          <div style={inputGroupContainer}>
            <label style={labelStyle}>Seu Nome:</label>
            <input
              type="text"
              value={nomeJogador}
              onChange={(e) => setNomeJogador(e.target.value)}
              placeholder="Ex: João"
              style={inputStyle}
            />
          </div>

          <div style={inputGroupContainer}>
            <label style={labelStyle}>Rodadas:</label>
            <div>
              <input
                type="number"
                // min="1"
                max="20"
                value={numRodadas}
                onChange={(e) => setNumRodadas(parseInt(e.target.value))}
                style={numberInput}
              />
            </div>
          </div>
        </div>
        <div style={buttonsContainer}>
          <HoverButton style={secondaryButtonStyle} onClick={handleVoltar}>
            Voltar
          </HoverButton>
          <HoverButton style={primaryButtonStyle} onClick={handleProsseguir}>
            Jogar
          </HoverButton>
        </div>
      </div>
    </div>
  );
}
