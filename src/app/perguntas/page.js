'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { perguntas } from '../../database/perguntas';
import {useRouter} from 'next/navigation';

export default function PerguntasPage() {
  const router = useRouter();
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
  const [perguntaBoxHeight, setPerguntaBoxHeight] = useState(0);

  const audioCronometroRef = useRef(null);
  const audioCertoRef = useRef(null);
  const audioErradoRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [quantidadeRodadas, setQuantidadeRodadas] = useState(0);
  // NOVO: Estado para armazenar as perguntas do jogo (limitadas pelo num de rodadas)
  const [perguntasDoJogo, setPerguntasDoJogo] = useState([]);

  // Pergunta atual baseada nas perguntas selecionadas para o jogo
  const perguntaOriginal = perguntasDoJogo[perguntaAtualIndex];

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

  // Carrega gameConfig do sessionStorage e seleciona as perguntas
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedGameConfig = sessionStorage.getItem('gameConfig');
      let numRodadas = perguntas.length; // Valor padrão: todas as perguntas

      if (storedGameConfig) {
        try {
          const gameConfig = JSON.parse(storedGameConfig);
          if (gameConfig && typeof gameConfig.rodadas === 'number' && gameConfig.rodadas > 0) {
            // Garante que o número de rodadas não excede o total de perguntas disponíveis
            numRodadas = Math.min(gameConfig.rodadas, perguntas.length);
          } else {
            console.warn("gameConfig encontrado, mas 'rodadas' não é um número válido ou é zero. Usando todas as perguntas disponíveis.");
          }
        } catch (error) {
          console.error("Erro ao fazer parse de 'gameConfig' do sessionStorage:", error);
        }
      } else {
        console.warn("gameConfig não encontrado no sessionStorage. Usando todas as perguntas disponíveis.");
      }

      setQuantidadeRodadas(numRodadas);

      // Seleciona e embaralha um subconjunto das perguntas originais
      const perguntasEmbaralhadasCompletas = shuffleArray([...perguntas]);
      const perguntasSelecionadasParaJogo = perguntasEmbaralhadasCompletas.slice(0, numRodadas);
      setPerguntasDoJogo(perguntasSelecionadasParaJogo);
    }
  }, []); // Executa apenas uma vez ao montar o componente

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
  }, [perguntaOriginal, perguntaBoxHeight]);

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

    // AQUI: A condição de fim de jogo usa quantidadeRodadas (do sessionStorage)
    if (perguntaAtualIndex < quantidadeRodadas - 1) {
      setPerguntaAtualIndex(prevIndex => prevIndex + 1);
      setTempoRestante(30);
    } else {
      alert('Fim do jogo! Todas as ' + quantidadeRodadas + ' rodadas configuradas foram respondidas.');
      // Opcional: Redirecionar para uma tela de resultados ou reiniciar
      setPerguntaAtualIndex(0); // Reinicia para a primeira pergunta do conjunto atual
      // Exemplo de redirecionamento:
      // window.location.href = '/resultados';
      router.push('/');
    }
  }, [perguntaAtualIndex, quantidadeRodadas]);

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

  // --- Lógica de responsividade ---
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // --- Estilos Responsivos ---
  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1a202c',
    color: '#edf2f7',
    padding: isMobile ? '10px' : '20px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: isMobile ? "scroll":"hidden"
  };

  const leftPanelStyle = {
    flex: isMobile ? '1' : '0.7',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    background: 'linear-gradient(135deg, #1d3c7cff, #081b44ff)',
    padding: isMobile ? '10px' : '20px',
  };

  const rightPanelStyle = {
    flex: isMobile ? 'unset' : '0.3',
    height: isMobile ? '100px' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: isMobile ? '3em' : '5em',
    fontWeight: 'bold',
    backgroundColor: '#4a5568',
    borderRadius: '8px',
    marginLeft: isMobile ? '0' : '20px',
    marginTop: isMobile ? '10px' : '0',
    width: isMobile ? '100%' : 'auto',
    zIndex: 1,
    padding: '20px',
  };

  const perguntaBoxStyle = {
    background: 'linear-gradient(to bottom, #8B0000 0%, #FF4500 50%, #8B0000 100%)',
    color: 'white',
    padding: isMobile ? '20px' : '30px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    fontSize: isMobile ? '1.5em' : '2.2em',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    position: isMobile ? 'relative' : 'absolute',
    top: isMobile ? '0' : '90px',
    left: isMobile ? '0' : '50%',
    transform: isMobile ? 'translateX(0)' : 'translateX(-50%)',
    width: isMobile ? '100%' : 'calc(100% + 150px)',
    maxWidth: isMobile ? '100%' : 'auto',
    zIndex: 2,
  };

  const alternativasContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '10px' : '15px',
    width: '100%',
    marginTop: isMobile ? `${perguntaBoxHeight - 80}px` : `${perguntaBoxHeight - 20}px`,
    marginBottom: isMobile ? '80px' : '0',
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
      padding: isMobile ? '12px 18px' : '15px 25px',
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '1em' : '1.2em',
      cursor: (respondido || indexAtual >= alternativasVisiveis) ? 'default' : 'pointer',
      transition: 'background-color 0.3s ease, transform 0.1s ease',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
      fontWeight: 'bold',
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
    width: isMobile ? '30px' : '40px',
    height: isMobile ? '30px' : '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isMobile ? '10px' : '15px',
    fontWeight: 'bold',
    fontSize: isMobile ? '1.2em' : '1.4em',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    flexShrink: 0,
  };

  const proximaPerguntaButtonStyle = {
    padding: isMobile ? '10px 20px' : '15px 30px',
    fontSize: isMobile ? '1.2em' : '1.5em',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
    transition: 'all 0.5s ease-out',
    position: 'fixed',
    bottom: mostrarBotaoProxima ? (isMobile ? '20px' : '50px') : '-100px',
    left: '50%',
    transform: 'translateX(-50%)',
    opacity: mostrarBotaoProxima ? 1 : 0,
    zIndex: 10,
  };

  const logoStyle = {
    width: isMobile ? '150px' : '200px',
    height: 'auto',
    marginBottom: isMobile ? '10px' : '20px',
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
      <div style={{ display: 'flex', width: '100%', flex: 1, flexDirection: isMobile ? 'column' : 'row' }}>
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