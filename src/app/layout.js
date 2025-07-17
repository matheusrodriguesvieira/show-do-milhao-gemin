import "./globals.css";

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'], // Idioma suportado
  weight: ['400', '700'], // Espessuras desejadas
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}