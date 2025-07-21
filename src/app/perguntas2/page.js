"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { perguntas as todasAsPerguntas } from "../../database/perguntas";
import { useRouter } from "next/navigation";

export default function PerguntasPage() {
  const router = useRouter();

  // --- 1. CONFIGURAÇÃO DO JOGO (LIDA DO sessionStorage) ---
  const [gameConfig, setGameConfig] = useState(null);

  // --- 2. ESTADOS DO JOGO (COMUNS E ESPECÍFICOS) ---
  const [tempoRestante, setTempoRestante] = useState(30);
  const [respondido, setRespondido] = useState(false);
  const [respostaStatus, setRespostaStatus] = useState("");
  const [selecionada, setSelecionada] = useState(null);
  const [alternativasVisiveis, setAlternativasVisiveis] = useState(0);
  const [mostrarBotaoProxima, setMostrarBotaoProxima] = useState(false);
  const [animacaoPiscarClasse, setAnimacaoPiscarClasse] = useState("");

  const [alternativasEmbaralhadas, setAlternativasEmbaralhadas] = useState([]);
  const [respostaCorretaEmbaralhadaIndex, setRespostaCorretaEmbaralhadaIndex] =
    useState(null);
  const [perguntaAtualObjeto, setPerguntaAtualObjeto] = useState(null);

  const perguntaBoxRef = useRef(null);
  const [perguntaBoxHeight, setPerguntaBoxHeight] = useState(0);

  const audioCronometroRef = useRef(null);
  const audioCertoRef = useRef(null);
  const audioErradoRef = useRef(null);

  // Estados dos jogadores (UNIFICADO)
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Rodada atual (para multiplayer)
  const [rodadaAtualInterna, setRodadaAtualInterna] = useState(1);

  // NOVO: Pool de perguntas para o jogo inteiro (IDs das perguntas)
  const [gameQuestionsPool, setGameQuestionsPool] = useState([]);
  // NOVO: Contador total de perguntas já jogadas no jogo (não por jogador)
  const [totalPerguntasJogadasNoJogo, setTotalPerguntasJogadasNoJogo] =
    useState(0);

  const [gameStatus, setGameStatus] = useState([]);
  function obterPerguntasAleatorias(numeroDeItens) {
    // Cria uma cópia do array para não modificar o original
    const arrayCopia = [...todasAsPerguntas];
    const itensAleatorios = [];

    // Garante que o número de itens solicitados não seja maior que o tamanho do array

    for (let i = 0; i < numParaSelecionar; i++) {
      // Gera um índice aleatório
      const indiceAleatorio = Math.floor(Math.random() * arrayCopia.length);

      // Adiciona o item aleatório ao array de resultados
      itensAleatorios.push(arrayCopia[indiceAleatorio]);

      // Remove o item selecionado do array cópia para evitar duplicatas (opcional, dependendo do caso de uso)
      arrayCopia.splice(indiceAleatorio, 1);
    }

    return itensAleatorios;
  }

  //pega item do sessionstorage
  useEffect(() => {
    const gameConfig = sessionStorage.getItem("gameConfig");

    // 4. Se encontrou algo, faz o parse (JSON.parse) para transformar a string de volta em objeto.
    if (gameConfig) {
      setGameConfig(JSON.parse(gameConfig));
    } else {
      // Opcional: Se não encontrou nada, você pode definir um valor padrão
      alert('session storage nao encontrado, redirecionado...');
      router.push('/');
      
    }
  }, []);

  useEffect(() => {
    if (!gameConfig) return; // Aguarda gameConfig ser carregado

    const savedGameStateString = sessionStorage.getItem("savedGameState");
    if (savedGameStateString) {
      try {
        const loadedState = JSON.parse(savedGameStateString);
        // Valida se o jogo salvo corresponde à config atual
        const configMatches =
          loadedState.players.length === gameConfig.quantidadeJogadores &&
          loadedState.players.every(
            (p, idx) => p.nome === gameConfig.nomesJogadores[idx]
          );

        // Verifica se o pool salvo ainda é válido (não está vazio se o jogo não terminou)
        const poolIsValid =
          loadedState.gameQuestionsPool &&
          loadedState.gameQuestionsPool.length > 0;
        // E se o total de perguntas jogadas no estado salvo é menor que o total necessário
        const gameNotFinishedInSave =
          loadedState.totalPerguntasJogadasNoJogo < totalPerguntasNecessarias;

        if (configMatches && poolIsValid && gameNotFinishedInSave) {
          setPlayers(loadedState.players);
          setGameQuestionsPool(loadedState.gameQuestionsPool);
          setCurrentPlayerIndex(loadedState.currentPlayerIndex);
          setRodadaAtualInterna(loadedState.rodadaAtualInterna);
          setTotalPerguntasJogadasNoJogo(
            loadedState.totalPerguntasJogadasNoJogo
          );
          alert(
            "Jogo salvo carregado! Clique em 'Próxima Pergunta' para continuar."
          );
          setMostrarBotaoProxima(true); // Mostra o botão para o usuário continuar
          // Retorna para não iniciar uma nova pergunta automaticamente AGORA
          return;
        } else {
          // Se o jogo salvo não corresponde ou já está terminado, inicia um novo jogo
          alert(
            "Jogo salvo não corresponde à configuração atual ou já está finalizado. Iniciando um novo jogo."
          );
          sessionStorage.removeItem("savedGameState"); // Limpa o salvo inválido
        }
      } catch (e) {
        console.error("Erro ao carregar jogo salvo:", e);
        alert("Erro ao carregar jogo salvo. Iniciando um novo jogo.");
        sessionStorage.removeItem("savedGameState");
      }
    }

    // Calcula o total de perguntas necessárias para o jogo
    const totalPerguntasNecessarias = gameConfig.quantidadeJogadores * gameConfig.rodadas;
    setGameQuestionsPool(obterPerguntasAleatorias(totalPerguntasNecessarias));
    
    const initialPlayers = gameConfig.nomesJogadores.map((name, index) => ({
        id: index,
        nome: name,
        pontuacao: 0,
      }));
      
      setGameStatus(initialPlayers);
      setTotalPerguntasJogadasNoJogo(0);
      setCurrentPlayerIndex(0);
      setRodadaAtualInterna(1);

    // Inicia a primeira pergunta APÓS tudo ter sido inicializado
    // gameQuestionsPool.length > 0 verifica se o pool foi populado ou carregado
    if (
      gameQuestionsPool.length > 0 &&
      !perguntaAtualObjeto &&
      !respondido &&
      respostaStatus === ""
    ) {
      selecionarProximaPergunta();
    }
  }, [
    gameConfig,
    gameQuestionsPool,
    players.length,
    perguntaAtualObjeto,
    respondido,
    respostaStatus,
    router,
    selecionarProximaPergunta,
    shuffleArray,
  ]); // Dependências


  const resetTurnStates = useCallback(() => {
    if (audioCronometroRef.current) {
      audioCronometroRef.current.pause();
      audioCronometroRef.current.currentTime = 0;
    }
    setRespondido(false);
    setRespostaStatus("");
    setSelecionada(null);
    setAlternativasVisiveis(0);
    setMostrarBotaoProxima(false);
    setAnimacaoPiscarClasse("");
    setPerguntaAtualObjeto(null);
    setTempoRestante(30);
  }, []);

  // Função para salvar o estado atual do jogo no sessionStorage
  const saveGameState = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.sessionStorage &&
      players.length > 0
    ) {
      try {
        const gameStateToSave = {
          players: players,
          gameQuestionsPool: gameQuestionsPool, // Salva o pool restante
          currentPlayerIndex: currentPlayerIndex,
          rodadaAtualInterna: rodadaAtualInterna,
          totalPerguntasJogadasNoJogo: totalPerguntasJogadasNoJogo,
          // Pode adicionar outros estados aqui se precisar restaurar exatamente o ponto do jogo
        };
        sessionStorage.setItem(
          "savedGameState",
          JSON.stringify(gameStateToSave)
        );
        // console.log('Estado do jogo salvo no sessionStorage.'); // Para depuração
      } catch (e) {
        console.error("Erro ao salvar estado do jogo no sessionStorage:", e);
      }
    }
  }, [
    players,
    gameQuestionsPool,
    currentPlayerIndex,
    rodadaAtualInterna,
    totalPerguntasJogadasNoJogo,
  ]);

  // --- 4. LÓGICA DE JOGO PRINCIPAL (AGORA UNIFICADA) ---

  const avancarPerguntaOuFinalizar = useCallback(() => {
    resetTurnStates(); // Reseta estados da UI

    // Calcula se é o fim do jogo
    const totalPerguntasNecessarias =
      gameConfig.quantidadeJogadores * gameConfig.rodadas;
    const jogoTerminou =
      gameQuestionsPool.length === 0 ||
      totalPerguntasJogadasNoJogo >= totalPerguntasNecessarias;

    if (jogoTerminou) {
      // FIM DO JOGO COMPLETO
      const resultadoDisplay = players
        .map((player) => `${player.nome}: ${player.pontuacao} pontos`)
        .join("\n");
      // A função salvarHistoricoPontuacao foi removida conforme pedido
      sessionStorage.removeItem("savedGameState"); // Limpa o jogo salvo do sessionStorage
      alert(`Fim do Jogo!\n\n${resultadoDisplay}`);
      router.push("/");
      return;
    } else {
      // Não é o fim do jogo, avança para o próximo jogador
      const proximoJogadorIndex =
        (currentPlayerIndex + 1) % gameConfig.quantidadeJogadores;

      if (proximoJogadorIndex === 0) {
        // Se voltou ao primeiro jogador, é uma nova rodada
        setRodadaAtualInterna((prev) => prev + 1);
      }
      setCurrentPlayerIndex(proximoJogadorIndex);
    }
    saveGameState(); // Salva o estado do jogo a cada avanço
  }, [
    totalPerguntasJogadasNoJogo,
    gameConfig,
    gameQuestionsPool,
    players,
    currentPlayerIndex,
    router,
    resetTurnStates,
    saveGameState,
  ]);

  // Seleção de Perguntas - Agora pega do gameQuestionsPool
  const selecionarProximaPergunta = useCallback(() => {
    // Garante que o gameConfig e o players array foram carregados
    if (!gameConfig || players.length === 0) return;

    // Verifica se o pool de perguntas está vazio (fim do jogo inesperado ou erro)
    if (gameQuestionsPool.length === 0) {
      console.warn(
        "Tentou selecionar pergunta, mas o pool está vazio. O jogo deveria ter finalizado."
      );
      avancarPerguntaOuFinalizar(); // Força a finalização se a condição não foi pega antes
      return null;
    }

    // Pega a primeira pergunta do pool (ela já está aleatória devido ao shuffle inicial)
    const proximaPerguntaId = gameQuestionsPool[0];
    const perguntaAleatoria = todasAsPerguntas.find(
      (p) => p.id === proximaPerguntaId
    );

    if (!perguntaAleatoria) {
      console.error(
        "Erro: ID de pergunta do pool não encontrado no banco de dados original. Redirecionando."
      );
      router.push("/"); // Redireciona em caso de erro grave
      return null;
    }

    // Remove a pergunta do pool (cria um novo array sem a primeira pergunta)
    setGameQuestionsPool((prevPool) => prevPool.slice(1));

    setTotalPerguntasJogadasNoJogo((prev) => prev + 1); // Incrementa o contador geral

    const alternativasCopiadas = [...perguntaAleatoria.alternativas];
    const alternativasEmbaralhadasLocal = shuffleArray(alternativasCopiadas); // Usa a função normal shuffleArray

    const textoRespostaCorreta =
      perguntaAleatoria.alternativas[perguntaAleatoria.respostaCorretaIndex];
    const novoIndexCorreto =
      alternativasEmbaralhadasLocal.indexOf(textoRespostaCorreta);

    setAlternativasEmbaralhadas(alternativasEmbaralhadasLocal);
    setPerguntaAtualObjeto(perguntaAleatoria);
    setRespostaCorretaEmbaralhadaIndex(novoIndexCorreto);
    return perguntaAleatoria;
  }, [
    gameConfig,
    gameQuestionsPool,
    players,
    nomesJogadores,
    router,
    avancarPerguntaOuFinalizar,
    shuffleArray,
  ]);

  // --- 5. EFEITOS DO REACT (CONTROLADORES DE FLUXO E ESTADO) ---

  // Efeito principal para carregar gameConfig, players, gameQuestionsPool e iniciar o jogo

  // Efeito para medir a altura da caixa da pergunta
  useEffect(() => {
    if (perguntaBoxRef.current) {
      requestAnimationFrame(() => {
        setPerguntaBoxHeight(perguntaBoxRef.current.offsetHeight);
      });
    }
  }, [perguntaAtualObjeto, perguntaBoxHeight]);

  // Efeito para o cronômetro
  useEffect(() => {
    let timer;
    if (
      gameConfig &&
      perguntaAtualObjeto &&
      tempoRestante > 0 &&
      !respondido &&
      respostaStatus !== "tempo_esgotado"
    ) {
      timer = setInterval(() => {
        setTempoRestante((prevTime) => prevTime - 1);
      }, 1000);
    } else if (
      gameConfig &&
      perguntaAtualObjeto &&
      tempoRestante === 0 &&
      !respondido &&
      respostaStatus !== "tempo_esgotado"
    ) {
      setRespostaStatus("tempo_esgotado");
      setTimeout(() => {
        avancarPerguntaOuFinalizar(); // Chamada unificada
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [
    gameConfig,
    tempoRestante,
    respondido,
    respostaStatus,
    perguntaAtualObjeto,
    avancarPerguntaOuFinalizar,
  ]);

  // Efeito para revelar alternativas
  useEffect(() => {
    let delayReveal;
    if (
      gameConfig &&
      perguntaAtualObjeto &&
      alternativasEmbaralhadas.length > 0 &&
      alternativasVisiveis < alternativasEmbaralhadas.length &&
      !respondido &&
      respostaStatus !== "tempo_esgotado"
    ) {
      delayReveal = setTimeout(() => {
        setAlternativasVisiveis((prevCount) => prevCount + 1);
      }, 300);
    } else if (
      gameConfig &&
      perguntaAtualObjeto &&
      alternativasEmbaralhadas.length > 0 &&
      alternativasVisiveis === alternativasEmbaralhadas.length &&
      !respondido &&
      respostaStatus !== "tempo_esgotado"
    ) {
      if (audioCronometroRef.current && audioCronometroRef.current.paused) {
        audioCronometroRef.current.currentTime = 0;
        audioCronometroRef.current
          .play()
          .catch((e) => console.error("Erro ao tocar áudio do cronômetro:", e));
      }
    }
    return () => {
      if (delayReveal) {
        clearTimeout(delayReveal);
      }
    };
  }, [
    gameConfig,
    alternativasVisiveis,
    alternativasEmbaralhadas,
    respondido,
    respostaStatus,
    perguntaAtualObjeto,
  ]);

  // --- 7. MANIPULADORES DE EVENTOS ---
  const handleRespostaClick = (alternativaClicadaTexto, indexClicado) => {
    if (respondido) return;

    if (audioCronometroRef.current) {
      audioCronometroRef.current.pause();
      audioCronometroRef.current.currentTime = 0;
    }

    setRespondido(true);
    setSelecionada(alternativaClicadaTexto);

    if (indexClicado === respostaCorretaEmbaralhadaIndex) {
      setRespostaStatus("correta");
      setAnimacaoPiscarClasse("piscar-correta");
      // Lógica de pontuação unificada: atualiza 'players'
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        newPlayers[currentPlayerIndex].pontuacao += 1;
        return newPlayers;
      });
      if (audioCertoRef.current) {
        audioCertoRef.current
          .play()
          .catch((e) => console.error("Erro ao tocar áudio de certo:", e));
      }
    } else {
      setRespostaStatus("errada");
      setAnimacaoPiscarClasse("piscar-errada");
      if (audioErradoRef.current) {
        audioErradoRef.current
          .play()
          .catch((e) => console.error("Erro ao tocar áudio de errado:", e));
      }
    }

    saveGameState(); // Salva o estado após cada resposta!

    setTimeout(() => {
      setMostrarBotaoProxima(true);
    }, 1000);
  };

  // --- 8. ESTILOS ---
  const containerStyle = {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#1a202c",
    color: "#edf2f7",
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  };

  const leftPanelStyle = {
    flex: 0.7,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    padding: "20px",
    background: "linear-gradient(135deg, #1d3c7cff, #081b44ff)",
  };

  const rightPanelStyle = {
    flex: 0.3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(74, 85, 104, 0.7)",
    borderRadius: "12px",
    marginLeft: "20px",
    zIndex: 1,
    padding: "30px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
    maxHeight: "calc(100vh - 40px)",
  };

  const perguntaGradient =
    "linear-gradient(to bottom, #8B0000 0%, #FF4500 50%, #8B0000 100%)";
  const alternativaHoverGradient =
    "linear-gradient(to bottom, #FF4500 0%, #FF8C00 100%)";

  const perguntaBoxStyle = {
    background: perguntaGradient,
    color: "white",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    fontSize: "2.2em",
    fontWeight: "bold",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
    position: "absolute",
    top: "90px",
    width: "calc(100% + 150px)",
    zIndex: 2,
  };

  const alternativasContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "90%",
    marginTop: `${perguntaBoxHeight > 0 ? perguntaBoxHeight + 120 : 250}px`,
  };

  const fadeInStyle = {
    opacity: 0,
    transform: "translateX(-20px)",
    transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
  };

  const fadeInVisibleStyle = {
    opacity: 1,
    transform: "translateX(0)",
  };

  const alternativaButtonStyle = (altTexto, indexAtual) => {
    let backgroundStyle = perguntaGradient;
    let textColor = "white";

    if (respondido) {
      if (indexAtual === respostaCorretaEmbaralhadaIndex) {
        backgroundStyle = "#48bb78";
      } else if (altTexto === selecionada) {
        backgroundStyle = "#f56565";
      } else {
        backgroundStyle = "#5a626d";
      }
    } else {
      backgroundStyle = perguntaGradient;
      textColor = "white";
    }

    return {
      background: backgroundStyle,
      color: textColor,
      padding: "15px 25px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.2em",
      cursor:
        respondido || indexAtual >= alternativasVisiveis
          ? "default"
          : "pointer",
      transition: "background 0.3s ease, transform 0.1s ease",
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
      fontWeight: "bold",
      "&:hover": {
        transform: respondido ? "none" : "translateY(-2px)",
        background: respondido ? backgroundStyle : alternativaHoverGradient,
      },
    };
  };

  const alternativaNumberCircleStyle = {
    backgroundColor: "#e0f2f7",
    color: "#3182ce",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "15px",
    fontWeight: "bold",
    fontSize: "1.4em",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
    flexShrink: 0,
  };

  const proximaPerguntaButtonStyle = {
    padding: "15px 30px",
    fontSize: "1.5em",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
    transition: "all 0.5s ease-out",
    position: "absolute",
    bottom: mostrarBotaoProxima ? "50px" : "-100px",
    left: "50%",
    transform: mostrarBotaoProxima
      ? "translateX(-50%)"
      : "translateX(-50%) translateY(100px)",
    opacity: mostrarBotaoProxima ? 1 : 0,
    zIndex: 10,
  };

  const logoStyle = {
    width: "180px",
    height: "auto",
    marginBottom: "20px",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
    zIndex: 3,
  };

  const scoreBoardContainerStyle = {
    width: "100%",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "15px 10px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  };

  const scoreTextItemStyle = {
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "white",
    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  };

  const cronometerTextStyle = {
    fontSize: "5em",
    fontWeight: "bold",
    color: "white",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const currentTurnTextStyle = {
    fontSize: "1.3em",
    fontWeight: "bold",
    color: "#ffd700",
    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  };

  return (
    // Renderiza o componente somente se a configuração for carregada (gameConfig não é null)
    !gameConfig ? (
      <div style={containerStyle}>
        <p>Carregando configurações do jogo...</p>
      </div>
    ) : (
      <div style={containerStyle}>
        <style jsx global>{`
          html,
          body {
            overflow: hidden;
            margin: 0;
            padding: 0;
          }
          @keyframes piscarCorreta {
            0%,
            100% {
              background-color: #48bb78;
            }
            50% {
              background-color: #76e0a1;
            }
          }

          @keyframes piscarErrada {
            0%,
            100% {
              background-color: #f56565;
            }
            50% {
              background-color: #ff9999;
            }
          }

          .piscar-correta {
            animation: piscarCorreta 0.6s ease-in-out 3;
          }

          .piscar-errada {
            animation: piscarErrada 0.6s ease-in-out 3;
          }
        `}</style>

        <audio
          ref={audioCronometroRef}
          src="/assets/sounds/cronometro.mp3"
          preload="auto"
        />
        <audio
          ref={audioCertoRef}
          src="/assets/sounds/certo.mp3"
          preload="auto"
        />
        <audio
          ref={audioErradoRef}
          src="/assets/sounds/errado.mp3"
          preload="auto"
        />

        <div style={{ display: "flex", width: "100%", flex: 1 }}>
          <div style={leftPanelStyle}>
            <img
              src="/assets/images/logo.png"
              alt="Logo do Jogo"
              style={logoStyle}
            />

            {perguntaAtualObjeto ? (
              <>
                <div ref={perguntaBoxRef} style={perguntaBoxStyle}>
                  {perguntaAtualObjeto.pergunta}
                </div>
                <div style={alternativasContainerStyle}>
                  {alternativasEmbaralhadas.map((alt, index) => (
                    <button
                      key={index}
                      onClick={() => handleRespostaClick(alt, index)}
                      disabled={respondido || index >= alternativasVisiveis}
                      className={
                        selecionada === alt ? animacaoPiscarClasse : ""
                      }
                      style={{
                        ...alternativaButtonStyle(alt, index),
                        ...fadeInStyle,
                        ...(index < alternativasVisiveis
                          ? fadeInVisibleStyle
                          : {}),
                      }}
                    >
                      <span style={alternativaNumberCircleStyle}>
                        {index + 1}
                      </span>
                      {alt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p>Carregando pergunta...</p>
            )}
          </div>

          <div style={rightPanelStyle}>
            <div
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                color: "white",
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                marginBottom: "10px",
              }}
            >
              Tempo Restante
            </div>

            <div style={cronometerTextStyle}>{tempoRestante}</div>

            <div style={scoreBoardContainerStyle}>
              {/* Placar unificado */}
              {players.map((player) => (
                <span key={player.id} style={scoreTextItemStyle}>
                  {player.nome}: {player.pontuacao} pts{" "}
                  {player.id === currentPlayerIndex &&
                    (gameConfig.quantidadeJogadores === 2 ? "(Atual)" : "")}
                </span>
              ))}
            </div>

            {/* Progresso do jogo unificado */}
            <div style={currentTurnTextStyle}>
              {gameConfig.quantidadeJogadores === 1
                ? `Pergunta: ${totalPerguntasJogadasNoJogo} / ${gameConfig.rodadas}`
                : `Rodada: ${rodadaAtualInterna} / ${gameConfig.rodadas} - Jogador: ${gameConfig.nomesJogadores[currentPlayerIndex]}`}
            </div>
          </div>
        </div>

        <button
          onClick={avancarPerguntaOuFinalizar}
          style={proximaPerguntaButtonStyle}
        >
          Próxima Pergunta
        </button>
      </div>
    )
  );
}
