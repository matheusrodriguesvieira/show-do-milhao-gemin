// src/hooks/useResponsividade.js
'use client'; // Indica que este hook deve ser executado no lado do cliente

import { useState, useEffect } from 'react';

// Define os breakpoints padrão. Você pode ajustá-los aqui se quiser mudar globalmente.
const BREAKPOINTS = {
  mobile: 768, // Telas menores que 768px
  tablet: 1024, // Telas entre 768px e 1024px
};

export function useResponsividade() {
  // Estado para armazenar a largura da janela
  const [windowWidth, setWindowWidth] = useState(0);

  // useEffect para configurar e limpar o event listener de redimensionamento
  useEffect(() => {
    // Garante que o código só é executado no ambiente do navegador
    if (typeof window === 'undefined') {
      // Se não estiver no navegador (SSR), definimos um valor inicial seguro
      setWindowWidth(0); // Ou qualquer valor padrão que faça sentido
      return;
    }

    // Inicializa a largura da janela na montagem
    setWindowWidth(window.innerWidth);

    // Função para atualizar a largura da janela no redimensionamento
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Adiciona o listener
    window.addEventListener('resize', handleResize);

    // Função de limpeza: remove o listener ao desmontar o componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Calcula os booleanos de breakpoint com base na largura atual da janela
  const isMobile = windowWidth < BREAKPOINTS.mobile;
  const isTablet = windowWidth >= BREAKPOINTS.mobile && windowWidth < BREAKPOINTS.tablet;
  const isDesktop = windowWidth >= BREAKPOINTS.tablet; // Desktop ou maior que tablet

  // Retorna os valores que podem ser usados no componente
  return { windowWidth, isMobile, isTablet, isDesktop };
}