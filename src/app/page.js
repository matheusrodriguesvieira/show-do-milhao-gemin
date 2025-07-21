'use client'; // Necessário para usar useState ou outros hooks de cliente se você decidir adicionar mais funcionalidades aqui

import Link from "next/link";

export default function Home() {
  // --- Estilos para a Tela Inicial ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    // Fundo gradiente azul
    background: 'linear-gradient(135deg, #1d3c7cff, #081b44ff)',
    color: '#edf2f7',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const logoStyle = {
    width: '250px', // Ajuste o tamanho do logo conforme sua preferência
    height: 'auto',
    marginBottom: '30px',
    filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))', // Efeito de brilho para o logo
  };

  const subtitleStyle = {
    fontSize: '1.8em', // Tamanho para o subtítulo
    fontWeight: 'normal',
    marginBottom: '40px', // Espaço abaixo do subtítulo e antes dos botões
    color: '#a0aec0', // Uma cor de texto mais suave para o subtítulo
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', // Sombra no texto do subtítulo
  };

  const buttonsContainerStyle = {
    display: 'flex',
    gap: '25px', // Espaço entre os botões
    flexWrap: 'wrap', // Permite quebrar linha em telas menores
    justifyContent: 'center',
  };

  const baseButtonStyle = {
    padding: '15px 35px',
    fontSize: '1.3em',
    fontWeight: 'bold',
    borderRadius: '8px',
    textDecoration: 'none', // Remove sublinhado padrão do Link
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  };

  // Botão "Jogar" (Branco)
  const primaryButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: 'white',
    color: '#081b44', // Texto escuro para contraste
    border: '2px solid white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Branco mais transparente no hover
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
    },
  };

  // Botão "Sobre" (Preto)
  const secondaryButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#333333', // Preto ou cinza bem escuro
    color: 'white',
    border: '2px solid #333333',
    '&:hover': {
      backgroundColor: '#555555', // Preto um pouco mais claro no hover
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
    },
  };


  return (
    <div style={containerStyle}>
      {/* Imagem do Logo */}
      <img src="/assets/images/logo.png" alt="Logo do Jogo" style={logoStyle} />

      {/* Subtítulo */}
      <h4 style={subtitleStyle}>Desafie seus conhecimentos e teste sua sorte!</h4>

      {/* Contêiner dos Botões */}
      <div style={buttonsContainerStyle}>
        <Link href={"/configuracoes"} style={primaryButtonStyle}>
          Jogar
        </Link>
        <Link href={"/sobre"} style={secondaryButtonStyle}>
          Sobre
        </Link>
      </div>
    </div>
  );
}