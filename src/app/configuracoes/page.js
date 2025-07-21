'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- ESTILOS CENTRALIZADOS E OTIMIZADOS ---
const CONTAINER_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontFamily: 'Arial, sans-serif',
  background: 'linear-gradient(135deg, #1d3c7cff, #081b44ff)',
  color: '#edf2f7',
  textAlign: 'center',
  padding: '20px',
  boxSizing: 'border-box',
};

const LOGO_STYLE = {
  width: '200px', // Ajuste o tamanho do logo
  height: 'auto',
  marginBottom: '30px',
  filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))',
};

const TITLE_STYLE = {
  fontSize: '2em',
  marginBottom: '30px',
};

const COLUMNS_CONTAINER_STYLE = {
  display: 'flex',
  justifyContent: 'space-around', // Ainda pode ser útil para centralizar o conteúdo em 1 coluna
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '900px',
  gap: '40px',
  flexWrap: 'wrap',
};

const COLUMN_STYLE = {
  flex: 1,
  minWidth: '300px',
  backgroundColor: 'rgba(45, 55, 72, 0.5)',
  borderRadius: '10px',
  padding: '30px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  marginBottom: '20px', // Espaçamento se quebrar linha
};

const CONFIG_SECTION_BASE_STYLE = {
  marginBottom: '25px',
};

const LABEL_STYLE = {
  fontSize: '1.2em',
  marginBottom: '10px',
  display: 'block',
  fontWeight: 'bold',
};

const INPUT_GROUP_STYLE = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '20px',
};

const TEXT_INPUT_STYLE = {
  padding: '10px 15px',
  fontSize: '1em',
  borderRadius: '5px',
  border: '2px solid #4a5568',
  backgroundColor: '#2d3748',
  color: '#edf2f7',
  width: 'calc(100% - 34px)',
  maxWidth: '300px',
  marginBottom: '15px',
  textAlign: 'center',
};

const NUMBER_INPUT_STYLE = {
  padding: '10px',
  fontSize: '1em',
  borderRadius: '5px',
  border: '2px solid #4a5568',
  backgroundColor: '#2d3748',
  color: '#edf2f7',
  width: '80px',
  textAlign: 'center',
};

const BUTTONS_CONTAINER_STYLE = {
  display: 'flex',
  gap: '20px',
  marginTop: '30px',
};

export default function ConfiguracoesPage() {
  const [numRodadas, setNumRodadas] = useState(3);
  const [nomeJogador1, setNomeJogador1] = useState('');

  const router = useRouter();

  const handleProsseguir = () => {
    if (nomeJogador1.trim() === '') {
      alert('Por favor, insira o seu nome.');
      return;
    }
    if (numRodadas < 1) {
      alert('O número de rodadas deve ser no mínimo 1.');
      setNumRodadas(1);
      return;
    }

    const config = {
      quantidadeJogadores: 1,
      rodadas: numRodadas,
      nomesJogadores: [nomeJogador1.trim()],
    };

    sessionStorage.setItem('gameConfig', JSON.stringify(config));
    router.push('/perguntas');
  };

  const actionButtonStyle = useMemo(() => (isPrimary) => ({
    padding: '12px 25px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    backgroundColor: isPrimary ? '#4CAF50' : '#e53e3e',
    color: 'white',
    border: `2px solid ${isPrimary ? '#4CAF50' : '#e53e3e'}`,
  }), []);


  return (
    <div style={CONTAINER_STYLE} className="container-responsive">
      {/* Adicionado o bloco style jsx global para responsividade */}
      <style jsx global>{`
        /* Estilos globais para reset e responsividade */
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden; /* Evita rolagem horizontal */
        }

        /* Classes para aplicar estilos responsivos */
        @media (max-width: 768px) {
          .container-responsive {
            padding: 15px;
            height: auto; /* Permite que a altura se ajuste ao conteúdo */
            min-height: 100vh; /* Garante que ocupe a tela inteira */
            justify-content: flex-start; /* Alinha o conteúdo ao topo em telas menores */
          }

          .logo-responsive {
            width: 150px; /* Reduz o tamanho do logo */
          }

          .title-responsive {
            font-size: 1.3em; /* Reduz o tamanho do título */
            margin-bottom: 20px;
          }

          .columns-container-responsive {
            flex-direction: column; /* Coloca as colunas em pilha */
            gap: 20px; /* Reduz o espaçamento entre colunas */
            max-width: 100%; /* Ocupa a largura total */
          }

          .column-responsive {
            min-width: unset; /* Remove o min-width para flexibilidade total */
            width: 95%; /* Ocupa quase a largura total */
            padding: 20px;
            margin-bottom: 0; /* Remove a margem inferior para empilhamento */
          }

          .label-responsive {
            font-size: 1em; /* Reduz o tamanho da fonte do label */
            margin-bottom: 8px;
          }

          .input-group-responsive {
            flex-direction: column; /* Empilha os inputs */
            gap: 10px;
          }

          .text-input-responsive,
          .number-input-responsive {
            width: calc(100% - 24px); /* Ajusta a largura para o padding */
            max-width: unset; /* Remove o max-width */
            font-size: 0.9em;
            padding: 8px 12px;
            margin-bottom: 10px;
          }
          
          .number-input-responsive {
            width: 70px; /* Mantém um tamanho razoável para o input de número */
          }

          .buttons-container-responsive {
            flex-direction: column; /* Empilha os botões */
            gap: 15px; /* Reduz o espaçamento entre botões */
            margin-top: 20px;
          }

          .action-button-responsive {
            padding: 10px 20px;
            font-size: 1em;
          }
        }

        @media (max-width: 480px) {
          .logo-responsive {
            width: 120px;
          }
          .title-responsive {
            font-size: 1em;
          }
          .column-responsive {
            padding: 15px;
          }
          .label-responsive {
            font-size: 0.9em;
          }
          .text-input-responsive,
          .number-input-responsive {
            font-size: 0.85em;
            padding: 6px 10px;
          }
          .action-button-responsive {
            font-size: 0.9em;
            padding: 8px 15px;
          }
        }
      `}</style>

      <img src="/assets/images/logo.png" alt="Logo do Jogo" style={LOGO_STYLE} className="logo-responsive" />

      <h2 style={TITLE_STYLE} className="title-responsive">Configurar Jogo</h2>

      <div style={COLUMNS_CONTAINER_STYLE} className="columns-container-responsive">
        <div style={COLUMN_STYLE} className="column-responsive">
          <div style={CONFIG_SECTION_BASE_STYLE}>
            <label style={LABEL_STYLE} className="label-responsive">Seu Nome:</label>
            <input
              type="text"
              value={nomeJogador1}
              onChange={(e) => setNomeJogador1(e.target.value)}
              placeholder="Ex: João"
              style={TEXT_INPUT_STYLE}
              className="text-input-responsive"
            />
          </div>

          <div style={CONFIG_SECTION_BASE_STYLE}>
            <label style={LABEL_STYLE} className="label-responsive">Quantidade de Perguntas:</label>
            <div style={INPUT_GROUP_STYLE} className="input-group-responsive">
              <input
                type="number"
                min="1"
                max="20"
                value={numRodadas}
                onChange={(e) => setNumRodadas(parseInt(e.target.value) || 1)}
                style={NUMBER_INPUT_STYLE}
                className="number-input-responsive"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={BUTTONS_CONTAINER_STYLE} className="buttons-container-responsive">
        <Link href="/" style={actionButtonStyle(false)} className="action-button-responsive">
          Voltar
        </Link>
        <button onClick={handleProsseguir} style={actionButtonStyle(true)} className="action-button-responsive">
          Prosseguir
        </button>
      </div>
    </div>
  );
}