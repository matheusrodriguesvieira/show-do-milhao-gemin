"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { perguntas } from "../../database/perguntas";
import { useRouter } from "next/navigation";
import { useResponsividade } from "../../hooks/useResponsividade";
import ProgressBarTimer from "@/components/barraProgresso";

export default function perguntasPage() {
  // const [gameConfig, setGameConfig] = useState(null);
  const [jogadorNome, setJogadorNome] = useState("");
  const [quantidadeRodadas, setQuantidadeRodadas] = useState(0);
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(30);
  const [respondido, setRespondido] = useState(false);
  const [respostaStatus, setRespostaStatus] = useState("");
  const [mostrarBotaoProxima, setMostrarBotaoProxima] = useState(false);
  const [perguntasDoJogo, setPerguntasDoJogo] = useState([]);

  const [indexRespostaSelecionada, setIndexRespostaSelecionada] =
    useState(null);
  const [alternativasVisiveis, setAlternativasVisiveis] = useState(0);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);

  // const [animacaoPiscarClasse, setAnimacaoPiscarClasse] = useState("");

  // NOVO: Estado para armazenar as perguntas do jogo (limitadas pelo num de rodadas)
  // const [respostaCorretaEmbaralhadaIndex, setRespostaCorretaEmbaralhadaIndex] =
  //   useState(null);
  // const perguntaBoxRef = useRef(null);
  // const [perguntaBoxHeight, setPerguntaBoxHeight] = useState(0);

  const audioCronometroRef = useRef(null);
  const audioCertoRef = useRef(null);
  const audioErradoRef = useRef(null);

  const router = useRouter();
  const { windowWidth, isMobile, isTablet, isDesktop } = useResponsividade();

  const containerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column-reverse" : "row",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#1a202c",
    color: "#edf2f7",
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
    overflow: isMobile ? "auto" : "hidden",
    width: "100vw",
    scrollbarWidth: "none" /* Firefox */,
    // justifyContent: 'reverse'
  };

  const logoStyle = {
    // width: "200px",
    height: "90%",
    // marginBottom: "20px",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
    zIndex: 3,
    // backgroundColor: "pink",
    objectFit: "contain",
  };

  const logoContainer = {
    display: "flex",
    // position:'absolute',
    // flexDirection: 'row',
    width: "90%",
    height: isMobile ? "10%" : "15%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "purple",
    position: "relative",
  };

  const leftPanelStyle = {
    flex: "0.7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    background: "linear-gradient(135deg, #1d3c7cff, #081b44ff)",
    // background: "green",
    padding: isMobile ? '10px' : "15px",
    height: isMobile ? "90%" : "100%",
  };

  const rightPanelStyle = {
    flex: "0.3",
    height: isMobile ? "8%" : "100%",
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    justifyContent: "center",
    gap: '2%',
    alignItems: "center",
    // fontSize: "5em",
    // fontWeight: "bold",
    backgroundColor: "#4a5568",
    borderRadius: "8px",
    marginLeft: isMobile ? "0" : "20px",
    marginTop: "0",
    width: "auto",
    zIndex: 1,
    padding: isMobile ? "5px" : "20px",
  };

  const perguntaBoxStyle = {
    background:
      "linear-gradient(to bottom, #8B0000 0%, #FF4500 50%, #8B0000 100%)",
    // background: isDesktop ? "blue": 'red',
    color: "white",
    padding: isMobile ? "15px" : "30px",
    borderRadius: "15px",
    // textAlign: "center",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    fontSize: isMobile ? "1.2em" : "2.2em",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    // position: "absolute",
    // top: "-300px",
    // left:"50%",
    // transform: "translateX(-50%)",
    // width: "calc(100% + 150px)",
    width: "calc(100% + 50px)",
    maxWidth: "auto",
    zIndex: 2,
    marginTop: "-5%",
  };

  const alternativasContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: isMobile ? '100%' : "80%",
    marginTop: "20px",
    // justifyContent: 'space-between'
    // backgroundColor: 'green'
    // marginBottom: isMobile ? '80px' : '0',
  };

  const alternativaNumberCircleStyle = {
    backgroundColor: "#e0f2f7",
    color: "#3182ce",
    borderRadius: "50%",
    width: isMobile ? "30px" : "40px",
    height: isMobile ? "30px" : "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "15px",
    fontWeight: "bold",
    fontSize: isMobile ? "1.1em" : "1.4em",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
    flexShrink: 0,
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

  const alternativasStyle = {
    color: "white",
    padding: "15px 25px",
    border: "none",
    borderRadius: "8px",
    fontSize: isMobile ? "1em" : "1.2em",
    transition: "background-color 0.3s ease, transform 0.1s ease",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
    fontWeight: "bold",
    // backgroundColor: 'purple'
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
    position: "fixed",
    bottom: mostrarBotaoProxima ? "50px" : "-100px",
    left: "50%",
    transform: "translateX(-50%)",
    opacity: mostrarBotaoProxima ? 1 : 0,
    zIndex: 10,
  };

  const pontuacaoCard = {
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    justifyContent: 'center',
    gap: '5%',
    // justifyContent: isMobile ? "center" : "space-between",
    alignItems: "center",
    height: isMobile ? "100%" : "35%",
    width: isMobile ? "79%" : "100%",
    // backgroundColor: "purple",
  };

  const labelTitle = {
    fontSize: isMobile ? "0.6rem  " : "0.9rem",
    textTransform: "uppercase",
    // fontWeight: 'bold'
    // backgroundColor: 'red'
  };

  const labelSubtitle = {
    fontSize: isMobile ? "1.2rem" : "2rem",
    textTransform: "uppercase",
    fontWeight: "bold",
  };

  const cronometroCard = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: isMobile ? "90%" : "20%",
    width: isMobile ? "29%" : "100%",
    // backgroundColor: "red",
    alignItems: "center",
  };

  const cronometroContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    // width: '30%',
    // width: isMobile? 'auto': '100%'
    // backgroundColor: 'purple'
  };

  const pontuacaoLabelContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.2rem",
    // backgroundColor: 'green',
    width: '100%'
  };
  // Carrega gameConfig do sessionStorage e seleciona as perguntas
  useEffect(() => {
    let storedGameConfig = sessionStorage.getItem("gameConfig");
    let numRodadas = perguntas.length; // Valor padrão: todas as perguntas

    // console.log(storedGameConfig ? 'existe': "nao existe");

    if (storedGameConfig) {
      try {
        let gameConfig = JSON.parse(storedGameConfig);
        if (
          gameConfig &&
          typeof gameConfig.rodadas === "number" &&
          gameConfig.rodadas > 0
        ) {
          // Garante que o número de rodadas não excede o total de perguntas disponíveis
          numRodadas = Math.min(gameConfig.rodadas, perguntas.length);
          setQuantidadeRodadas(numRodadas);
          setJogadorNome(gameConfig.nomesJogadores);
          setPerguntasDoJogo(perguntas.slice(0, numRodadas));
        } else {
          console.warn(
            "gameConfig encontrado, mas 'rodadas' não é um número válido ou é zero. Usando todas as perguntas disponíveis."
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
      console.warn("Gameconfig não encontrado. Retornando a tela inicial...");
      router.push("/");
    }

    // Seleciona e embaralha um subconjunto das perguntas originais
    // console.log(perguntasDoJogo);
  }, []); // Executa apenas uma vez ao montar o componente

  useEffect(() => {
    let delayReveal;
    if (
      perguntasDoJogo.length > 0 &&
      alternativasVisiveis <
        perguntasDoJogo[perguntaAtualIndex].alternativas.length &&
      !respondido &&
      respostaStatus !== "tempo_esgotado"
    ) {
      delayReveal = setTimeout(() => {
        setAlternativasVisiveis((prevCount) => prevCount + 1);
      }, 300);
    }
    return () => {
      if (delayReveal) {
        clearTimeout(delayReveal);
      }
    };
  }, [
    alternativasVisiveis,
    // perguntasDoJogo[perguntaAtualIndex].alternativas,
    respondido,
    respostaStatus,
    perguntasDoJogo,
  ]);

  useEffect(() => {
    if (
      perguntasDoJogo.length > 0 &&
      alternativasVisiveis ===
        perguntasDoJogo[perguntaAtualIndex].alternativas.length &&
      !respondido &&
      respostaStatus !== "tempo_esgotado"
    ) {
      if (audioCronometroRef.current && audioCronometroRef.current.paused) {
        audioCronometroRef.current.currentTime = 0;
        audioCronometroRef.current
          .play()
          .catch((e) => console.error("Erro ao tocar áudio do cronômetro:", e));
        console.log("ligando cronometro");
      }
    }
  }, [alternativasVisiveis, perguntasDoJogo]);

  useEffect(() => {
    let timer;
    if (
      tempoRestante > 0 &&
      !respondido &&
      respostaStatus !== "tempo_esgotado"
    ) {
      timer = setInterval(() => {
        setTempoRestante((prevTime) => prevTime - 1);
      }, 1000);
    } else if (
      tempoRestante === 0 &&
      !respondido &&
      respostaStatus !== "tempo_esgotado"
    ) {
      setRespostaStatus("tempo_esgotado");
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tempoRestante, respondido, respostaStatus]);

  const proximaPergunta = useCallback(() => {
    // console.log('proxima pergunta');

    if (audioCronometroRef.current) {
      audioCronometroRef.current.pause();
      audioCronometroRef.current.currentTime = 0;
    }

    setRespondido(false);
    setRespostaStatus("");
    setIndexRespostaSelecionada(null);
    setAlternativasVisiveis(0);
    setMostrarBotaoProxima(false);
    // setAnimacaoPiscarClasse('');

    // AQUI: A condição de fim de jogo usa quantidadeRodadas (do sessionStorage)
    if (perguntaAtualIndex < quantidadeRodadas - 1) {
      setPerguntaAtualIndex((prevIndex) => prevIndex + 1);
      setTempoRestante(30);
    } else {
      alert(
        "Fim do jogo! Todas as " +
          quantidadeRodadas +
          " rodadas configuradas foram respondidas."
      );
      // Opcional: Redirecionar para uma tela de resultados ou reiniciar
      let scoreFinal = {
        jogadorNome,
        pontuacaoTotal,
        quantidadeRodadas,
        taxaAcertos: (
          (pontuacaoTotal * 100) /
          (quantidadeRodadas * 25)
        ).toFixed(2),
      };

      sessionStorage.clear();
      sessionStorage.setItem("scoreFinal", JSON.stringify(scoreFinal));
      // setPerguntaAtualIndex(0); // Reinicia para a primeira pergunta do conjunto atual
      // Exemplo de redirecionamento:
      // window.location.href = '/resultados';
      router.push("/resultados");
    }
  }, [perguntaAtualIndex, quantidadeRodadas]);

  function handleRespostaClick(indexClicado) {
    if (respondido) return;
    if (audioCronometroRef.current) {
      audioCronometroRef.current.pause();
      audioCronometroRef.current.currentTime = 0;
    }
    setRespondido(true);
    setIndexRespostaSelecionada(indexClicado);
    if (
      indexClicado === perguntasDoJogo[perguntaAtualIndex].respostaCorretaIndex
    ) {
      setRespostaStatus("correta");
      setPontuacaoTotal((prevIndex) => prevIndex + 25);
      // setAnimacaoPiscarClasse('piscar-correta');
      if (audioCertoRef.current) {
        audioCertoRef.current
          .play()
          .catch((e) => console.error("Erro ao tocar áudio de certo:", e));
      }
    } else {
      setRespostaStatus("errada");
      // setAnimacaoPiscarClasse('piscar-errada');
      if (audioErradoRef.current) {
        audioErradoRef.current
          .play()
          .catch((e) => console.error("Erro ao tocar áudio de errado:", e));
      }
    }
    setTimeout(() => {
      setMostrarBotaoProxima(true);
    }, 1000);
  }

  function alternativaButtonStyle(indexAtual) {
    let bgColor =
      "linear-gradient(to bottom, #8B0000 0%, #FF4500 50%, #8B0000 100%)";

    if (respondido) {
      if (
        indexAtual === perguntasDoJogo[perguntaAtualIndex].respostaCorretaIndex
      ) {
        bgColor = "#48bb78";
      } else if (indexAtual === indexRespostaSelecionada) {
        bgColor = "#f56565";
      } else {
        bgColor = "#5a626d";
      }
    }

    return {
      background: bgColor,
      cursor:
        respondido || indexAtual >= alternativasVisiveis
          ? "default"
          : "pointer",
    };
  }

  return (
    <div style={containerStyle}>
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

      {/* Main content container para os painéis esquerdo e direito */}
      <div style={leftPanelStyle}>
        {/* Logo como um item flex normal */}
        <div style={logoContainer}>
          <img
            src="/assets/images/logo.png"
            alt="Logo do Jogo"
            style={logoStyle}
          />
        </div>
        {perguntasDoJogo[perguntaAtualIndex] ? (
          <>
            <div style={perguntaBoxStyle}>
              {perguntasDoJogo[perguntaAtualIndex].pergunta}
            </div>
            {/* Contêiner das Alternativas - Com marginTop dinâmico */}
            <div style={alternativasContainerStyle}>
              <>
                {perguntasDoJogo[perguntaAtualIndex].alternativas.map(
                  (alternativa, index) => (
                    <button
                      key={index}
                      // onClick={() => handleRespostaClick(alt, index)}
                      onClick={() => {
                        handleRespostaClick(index);
                      }}
                      style={{
                        ...alternativaButtonStyle(index),
                        ...alternativasStyle,
                        ...fadeInStyle,
                        ...(index < alternativasVisiveis
                          ? fadeInVisibleStyle
                          : {}),
                      }}
                    >
                      <span style={alternativaNumberCircleStyle}>
                        {index + 1}
                      </span>
                      {alternativa}
                    </button>
                  )
                )}
              </>
            </div>
          </>
        ) : (
          <div>Carregando...</div>
        )}
      </div>
      <div style={rightPanelStyle}>
        <div style={pontuacaoCard}>
          <div style={pontuacaoLabelContainer}>
            <label style={labelTitle}>Participante</label>
            <label style={labelSubtitle}>{jogadorNome}</label>
          </div>
          <div style={pontuacaoLabelContainer}>
            <label style={labelTitle}>Pontuação</label>
            <label
              style={{
                ...labelSubtitle,
                color: pontuacaoTotal > 0 ? "#27ae60" : "#fff",
              }}
            >
              {pontuacaoTotal}
            </label>
          </div>
          <div style={pontuacaoLabelContainer}>
            <label style={labelTitle}>Rodada</label>
            <label style={labelSubtitle}>
              {perguntaAtualIndex + 1} de {perguntasDoJogo.length}
            </label>
          </div>
        </div>
        <div style={cronometroCard}>
          <div style={labelTitle}>Tempo Restante</div>
          <div style={cronometroContainer}>
            <ProgressBarTimer
              key={perguntaAtualIndex}
              tempoRestante={tempoRestante}
              tempoTotal={30} // tempoTotal é 30
              height={isMobile ? 20 : 30} // Altura da barra responsiva
              borderRadius={isMobile ? 10 : 15} // Borda da barra responsiva
            />
            <div style={{...labelSubtitle, fontSize: isMobile ? '0.7rem': '2rem',}}>{tempoRestante} segundos</div>
          </div>
        </div>
      </div>

      <button onClick={proximaPergunta} style={proximaPerguntaButtonStyle}>
        Próxima Pergunta
      </button>
    </div>
  );
}
