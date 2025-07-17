'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { perguntas } from '../../database/perguntas';

export default function PerguntasPage() {
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(30);
  const [respondido, setRespondido] = useState(false);
  const [respostaStatus, setRespostaStatus] = useState('');
  const [selecionada, setSelecionada] = useState(null);
  const [alternativasVisiveis, setAlternativasVisiveis] = useState(0);
  const [mostrarBotaoProxima, setMostrarBotaoProxima] = useState(false);
  const [animacaoPiscarClasse, setAnimacaoPiscarClasse] = useState('');

  const [alternativasEmbaralhadas, setAlternativasEmbaralhadas] = useState([]);
  const [respostaCorretaEmbaralhadaIndex, setRespostaCorretaEmbaralhadaIndex] = useState(null);

  const perguntaBoxRef = useRef(null);
  const [perguntaBoxHeight, setPerguntaBoxHeight] = useState(0); // Estado para a altura da caixa de pergunta

  const audioCronometroRef = useRef(null);
  const audioCertoRef = useRef(null);
  const audioErradoRef = useRef(null);

  const perguntaOriginal = perguntas[perguntaAtualIndex];

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  useEffect(() => {
    if (perguntaOriginal) {
      const alternativasCopiadas = [...perguntaOriginal.alternativas];
      const alternativasEmbaralhadasLocal = shuffleArray(alternativasCopiadas);

      const textoRespostaCorreta = perguntaOriginal.alternativas[perguntaOriginal.respostaCorretaIndex];
      const novoIndexCorreto = alternativasEmbaralhadasLocal.indexOf(textoRespostaCorreta);

      setAlternativasEmbaralhadas(alternativasEmbaralhadasLocal);
      setRespostaCorretaEmbaralhadaIndex(novoIndexCorreto);
    }
  }, [perguntaAtualIndex, perguntaOriginal]);

  useEffect(() => {
    if (perguntaBoxRef.current) {
      requestAnimationFrame(() => {
        setPerguntaBoxHeight(perguntaBoxRef.current.offsetHeight);
      });
    }
  }, [perguntaOriginal, perguntaBoxHeight]); // Adicionado perguntaBoxHeight como dependência para re-executar se o valor mudar

  const proximaPergunta = useCallback(() => {
    if (audioCronometroRef.current) {
      audioCronometroRef.current.pause();
      audioCronometroRef.current.currentTime = 0;
    }

    setRespondido(false);
    setRespostaStatus('');
    setSelecionada(null);
    setAlternativasVisiveis(0);
    setMostrarBotaoProxima(false);
    setAnimacaoPiscarClasse('');

    if (perguntaAtualIndex < perguntas.length - 1) {
      setPerguntaAtualIndex(prevIndex => prevIndex + 1);
      setTempoRestante(30);
    } else {
      alert('Fim do jogo! Todas as perguntas foram respondidas.');
      setPerguntaAtualIndex(0);
    }
  }, [perguntaAtualIndex]);

  useEffect(() => {
    let timer;
    if (tempoRestante > 0 && !respondido && respostaStatus !== 'tempo_esgotado') {
      timer = setInterval(() => {
        setTempoRestante(prevTime => prevTime - 1);
      }, 1000);
    } else if (tempoRestante === 0 && !respondido && respostaStatus !== 'tempo_esgotado') {
      setRespostaStatus('tempo_esgotado');
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tempoRestante, respondido, respostaStatus]);

  useEffect(() => {
    let delayReveal;
    if (alternativasEmbaralhadas.length > 0 && alternativasVisiveis < alternativasEmbaralhadas.length && !respondido && respostaStatus !== 'tempo_esgotado') {
      delayReveal = setTimeout(() => {
        setAlternativasVisiveis(prevCount => prevCount + 1);
      }, 300);
    } else if (alternativasEmbaralhadas.length > 0 && alternativasVisiveis === alternativasEmbaralhadas.length && !respondido && respostaStatus !== 'tempo_esgotado') {
      if (audioCronometroRef.current && audioCronometroRef.current.paused) {
        audioCronometroRef.current.currentTime = 0;
        audioCronometroRef.current.play().catch(e => console.error("Erro ao tocar áudio do cronômetro:", e));
      }
    }
    return () => {
      if (delayReveal) {
        clearTimeout(delayReveal);
      }
    };
  }, [alternativasVisiveis, alternativasEmbaralhadas, respondido, respostaStatus]);

  const handleRespostaClick = (alternativaClicadaTexto, indexClicado) => {
    if (respondido) return;
    if (audioCronometroRef.current) {
      audioCronometroRef.current.pause();
      audioCronometroRef.current.currentTime = 0;
    }
    setRespondido(true);
    setSelecionada(alternativaClicadaTexto);
    if (indexClicado === respostaCorretaEmbaralhadaIndex) {
      setRespostaStatus('correta');
      setAnimacaoPiscarClasse('piscar-correta');
      if (audioCertoRef.current) {
        audioCertoRef.current.play().catch(e => console.error("Erro ao tocar áudio de certo:", e));
      }
    } else {
      setRespostaStatus('errada');
      setAnimacaoPiscarClasse('piscar-errada');
      if (audioErradoRef.current) {
        audioErradoRef.current.play().catch(e => console.error("Erro ao tocar áudio de errado:", e));
      }
    }
    setTimeout(() => {
      setMostrarBotaoProxima(true);
    }, 1000);
  };

  // --- Estilos ---
  const containerStyle = {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1a202c',
    color: '#edf2f7',
    padding: '20px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden'
  };

  const leftPanelStyle = {
    flex: 0.7,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    background: 'linear-gradient(135deg, #1d3c7cff, #081b44ff)'

    // padding: '20px',
  };

  const rightPanelStyle = {
    flex: 0.3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '5em',
    fontWeight: 'bold',
    backgroundColor: '#4a5568',
    borderRadius: '8px',
    marginLeft: '20px',
    zIndex: 1,
    padding: '20px',
  };

  const perguntaBoxStyle = {
    background: 'linear-gradient(to bottom, #8B0000 0%, #FF4500 50%, #8B0000 100%)',
    color: 'white',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    fontSize: '2.2em',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    position: 'absolute',
    // NOVO: Topo inicial fixo, ajustado para ser mais flexível com o logo
    top: '90px', // Posição fixa inicial que permite o logo acima
    // left: '20px',
    width: 'calc(100% + 150px)',
    zIndex: 2,
  };

  const alternativasContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '90%',
    // maxWidth: '600px',
    // NOVO: Margin top calculado dinamicamente
    // 70px (aprox. altura do logo com margens) + perguntaBoxHeight + 60px (espaçamento extra)
    marginTop: `${perguntaBoxHeight - 20}px`,
    
  };

  const fadeInStyle = {
    opacity: 0,
    transform: 'translateX(-20px)',
    transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
  };

  const fadeInVisibleStyle = {
    opacity: 1,
    transform: 'translateX(0)',
  };

  const alternativaButtonStyle = (altTexto, indexAtual) => {
    let bgColor = 'linear-gradient(to bottom, #8B0000 0%, #FF4500 50%, #8B0000 100%)';
    let textColor = 'white';

    if (respondido) {
      if (indexAtual === respostaCorretaEmbaralhadaIndex) {
        bgColor = '#48bb78';
      } else if (altTexto === selecionada) {
        bgColor = '#f56565';
      } else {
        bgColor = '#5a626d';
      }
    }

    return {
      background: bgColor,
      color: textColor,
      padding: '15px 25px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.2em',
      cursor: (respondido || indexAtual >= alternativasVisiveis) ? 'default' : 'pointer',
      transition: 'background-color 0.3s ease, transform 0.1s ease',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
      fontWeight:'bold',
      '&:hover': {
        transform: respondido ? 'none' : 'translateY(-2px)',
        backgroundColor: respondido ? bgColor : '#2b6cb0',
      },
    };
  };

  const alternativaNumberCircleStyle = {
    backgroundColor: '#e0f2f7',
    color: '#3182ce',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '15px',
    fontWeight: 'bold',
    fontSize: '1.4em',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
       textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',

    flexShrink: 0,
  };

  const proximaPerguntaButtonStyle = {
    padding: '15px 30px',
    fontSize: '1.5em',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
    transition: 'all 0.5s ease-out',
    position: 'absolute',
    bottom: mostrarBotaoProxima ? '50px' : '-100px',
    left: '50%',
    transform: mostrarBotaoProxima ? 'translateX(-50%)' : 'translateX(-50%) translateY(100px)',
    opacity: mostrarBotaoProxima ? 1 : 0,
    zIndex: 10,
  };

  const logoStyle = {
    width: '200px',
    height: 'auto',
    // marginTop: '20px',
    marginBottom: '20px',
    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
    zIndex: 3,
  };

  return (
    <div style={containerStyle}>
      <style jsx global>{`
        @keyframes piscarCorreta {
          0%, 100% { background-color: #48bb78; }
          50% { background-color: #76e0a1; }
        }

        @keyframes piscarErrada {
          0%, 100% { background-color: #f56565; }
          50% { background-color: #ff9999; }
        }

        .piscar-correta {
          animation: piscarCorreta 0.6s ease-in-out 3;
        }

        .piscar-errada {
          animation: piscarErrada 0.6s ease-in-out 3;
        }
      `}</style>

      <audio ref={audioCronometroRef} src="/assets/sounds/cronometro.mp3" preload="auto" />
      <audio ref={audioCertoRef} src="/assets/sounds/certo.mp3" preload="auto" />
      <audio ref={audioErradoRef} src="/assets/sounds/errado.mp3" preload="auto" />

      {/* Main content container para os painéis esquerdo e direito */}
      <div style={{ display: 'flex', width: '100%', flex: 1 }}>
        <div style={leftPanelStyle}>
          {/* Logo como um item flex normal */}
          <img src="/assets/images/logo.png" alt="Logo do Jogo" style={logoStyle} />

          {perguntaOriginal ? (
            <>
              {/* Caixa da Pergunta - Com ref para obter a altura */}
              <div ref={perguntaBoxRef} style={perguntaBoxStyle}>
                {perguntaOriginal.pergunta}
              </div>
              {/* Contêiner das Alternativas - Com marginTop dinâmico */}
              <div style={alternativasContainerStyle}>
                {alternativasEmbaralhadas.map((alt, index) => (
                  <button
                    key={index}
                    onClick={() => handleRespostaClick(alt, index)}
                    disabled={respondido || index >= alternativasVisiveis}
                    className={selecionada === alt ? animacaoPiscarClasse : ''}
                    style={{
                      ...alternativaButtonStyle(alt, index),
                      ...fadeInStyle,
                      ...(index < alternativasVisiveis ? fadeInVisibleStyle : {}),
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
            <p>Carregando perguntas...</p>
          )}
        </div>

        <div style={rightPanelStyle}>
          {tempoRestante}
        </div>
      </div>

      <button onClick={proximaPergunta} style={proximaPerguntaButtonStyle}>
        Próxima Pergunta
      </button>
    </div>
  );
}