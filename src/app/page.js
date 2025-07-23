"use client"; // Necessário para usar useState ou outros hooks de cliente se você decidir adicionar mais funcionalidades aqui

import { useRouter } from "next/navigation";
import { use, useState } from "react";

function HoverButton({ children, hoverStyle, style, ...props }) {
  const [isHovered, setIsHovered] = useState(false);

  const baseButtonStyle = {
    padding: "15px 35px",
    fontSize: "1.3em",
    fontWeight: "bold",
    borderRadius: "8px",
    textDecoration: "none", // Remove sublinhado padrão do Link
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    ...style
  };

  const hover = {
    transform: "scale(1.05)",
    ...hoverStyle
  };

  return (
    <button
      style={
        isHovered
          ? { ...baseButtonStyle, ...hover }
          : { ...baseButtonStyle }
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

export default function Home() {
  // --- Estilos para a Tela Inicial ---
  const router = useRouter();

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    // Fundo gradiente azul
    background: "linear-gradient(135deg, #1d3c7cff, #081b44ff)",
    color: "#edf2f7",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
  };

  const logoStyle = {
    width: "250px", // Ajuste o tamanho do logo conforme sua preferência
    height: "auto",
    marginBottom: "30px",
    filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))", // Efeito de brilho para o logo
  };

  const subtitleStyle = {
    fontSize: "1.8em", // Tamanho para o subtítulo
    fontWeight: "normal",
    marginBottom: "40px", // Espaço abaixo do subtítulo e antes dos botões
    color: "#a0aec0", // Uma cor de texto mais suave para o subtítulo
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Sombra no texto do subtítulo
  };

  const buttonsContainerStyle = {
    display: "flex",
    gap: "25px", // Espaço entre os botões
    flexWrap: "wrap", // Permite quebrar linha em telas menores
    justifyContent: "center",
  };

  // Botão "Jogar" (Branco)
  const primaryButtonStyle = {
    backgroundColor: "white",
    color: "#081b44", // Texto escuro para contraste
    border: "2px solid white",
  };

  const primaryButtonStyleHover = {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Branco mais transparente no hover
    transform: "translateY(-3px)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.4)",
  };

  // Botão "Sobre" (Preto)
  const secondaryButtonStyle = {
    backgroundColor: "#333333", // Preto ou cinza bem escuro
    color: "white",
    border: "2px solid #333333",
  };

  const secondaryButtonStyleHover = {
    backgroundColor: "#555555", // Preto um pouco mais claro no hover
    transform: "translateY(-3px)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.4)",
  };

  function handlejogar() {
    router.push("/configuracoes");
  }

  function handleSobre() {
    router.push("/sobre");
  }

  return (
    <div style={containerStyle}>
      {/* Imagem do Logo */}
      <img src="/assets/images/logo.png" alt="Logo do Jogo" style={logoStyle} />

      {/* Subtítulo */}
      <h4 style={subtitleStyle}>
        Desafie seus conhecimentos e teste sua sorte!
      </h4>

      {/* Contêiner dos Botões */}
      <div style={buttonsContainerStyle}>
        <HoverButton style={primaryButtonStyle} hoverStyle={primaryButtonStyleHover} onClick={handlejogar}>
          Jogar
        </HoverButton>
        <HoverButton style={secondaryButtonStyle} hoverStyle={secondaryButtonStyleHover} onClick={handleSobre}>
          Sobre
        </HoverButton>
      </div>
    </div>
  );
}
