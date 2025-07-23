// components/ProgressBarTimer.js
'use client';

import React from 'react';

const ProgressBarTimer = ({ tempoRestante, tempoTotal = 30, height = 20, borderRadius = 5 }) => {
  const porcentagem = (tempoRestante / tempoTotal) * 100;

  let barColor;
  if (tempoRestante > tempoTotal * 0.66) { // Mais de 2/3 do tempo
    barColor = '#4CAF50'; // Verde
  } else if (tempoRestante > tempoTotal * 0.33) { // Entre 1/3 e 2/3 do tempo
    barColor = '#FFC107'; // Amarelo
  } else { // Menos de 1/3 do tempo
    barColor = '#F44336'; // Vermelho
  }

  const containerStyle = {
    // A largura agora é sempre 100% do pai
    width: '100%', 
    height: `${height}px`,
    backgroundColor: '#5a626d', // Cor de fundo da barra vazia
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    position: 'relative',
  };

  const fillStyle = {
    width: `${porcentagem}%`,
    height: '100%',
    backgroundColor: barColor,
    borderRadius: `${borderRadius}px`,
    transition: 'width 1s linear, background-color 0.5s ease-in-out',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: `${height * 0.8}px`,
    fontWeight: 'bold',
  };

  const textStyle = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: `${height * 0.8}px`,
    fontWeight: 'bold',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  };

  return (
    <div style={containerStyle}>
      <div style={fillStyle}></div>
      <div style={textStyle}>
        {tempoRestante}s
      </div>
    </div>
  );
};

export default ProgressBarTimer;