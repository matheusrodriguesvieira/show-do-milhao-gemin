// pages/fim-de-jogo.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FimDeJogoPage() {
  const router = useRouter();
  const [scoreFinal, setScoreFinal] = useState([]); // Valor padrão

  useEffect(() => {
    if (sessionStorage.getItem("scoreFinal")) {
      try {
        let resultados = JSON.parse(sessionStorage.getItem("scoreFinal"));
        if ( resultados && typeof resultados == "object" && resultados.jogadorNome.trim() !== "" && typeof resultados.pontuacaoTotal ==='number'
        ) {
          // Garante que o número de rodadas não excede o total de perguntas disponíveis
          setScoreFinal(resultados);
        } else {
          console.warn(
            "Erro ao carregar o Score final do jogador."
          );
          router.push("/");
        }
      } catch (error) {
        console.error(
          "Erro ao fazer parse de 'gameConfig' do sessionStorage:",
          error
        );
        router.push("/");
      }
    } else {
      console.warn("Scorefinal não encontrado. Retornando a tela inicial...");
      router.push("/");
    }
  }, []);

  const handleVoltarInicio = () => {
    sessionStorage.clear();
    router.push("/"); // Redireciona para a tela inicial
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#1a202c", // Cor de fundo semelhante ao jogo
    color: "#edf2f7", // Cor do texto
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
  };

  const titleStyle = {
    fontSize: "3.5em",
    marginBottom: "20px",
    color: "#48bb78", // Verde para parabéns
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  };

  const messageStyle = {
    fontSize: "1.8em",
    marginBottom: "15px",
  };

  const scoreStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#ffd700", // Amarelo para pontuação
    marginBottom: "40px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  };

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "1.2em",
    backgroundColor: "#3182ce", // Azul para o botão
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    transition: "background-color 0.3s ease, transform 0.1s ease",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Parabéns!</h1>
      <p style={messageStyle}>
        Você concluiu o jogo,{" "}
        <span style={{ color: "#ffd700" }}>{scoreFinal.jogadorNome}</span>!
      </p>
      <p style={scoreStyle}>Sua pontuação final: {scoreFinal.pontuacaoTotal}</p>
      <p style={messageStyle}>
        Taxa de acertos: 
        <span  style={{color: '#ffd700'}}>
             {scoreFinal.taxaAcertos}%
        </span>
        </p>
      <button style={buttonStyle} onClick={handleVoltarInicio}>
        Voltar para o Início
      </button>
    </div>
  );
}
