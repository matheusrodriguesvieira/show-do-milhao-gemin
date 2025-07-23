'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function About() {
  const [isHovered, setHovered] = useState(false);

  const mainContainer = {
    display: "flex",
    padding: "10px",
    width: "100vw",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#eef2f5",
  };

  const contentContainer = {
    height: "95%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };

  const cardContainer = {
    padding: "50px 50px",
    backgroundColor: "#fff",
    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
    borderRadius: "10px",
    textAlign: "end",
  };

  const h4Style = {
    fontSize: "16px",
    color: "#000",
    fontStyle: "italic",
  };

  const link = {
    textDecoration: "none",
    color: "#000",
  };

  const voltarContainer = {
    display: "flex",
    height: "5%",
    width: "100%",
  };

  const btnVoltar = {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    transition: "0.25s",
  };
  const btnVoltarHover = {
    transform: "scaleX(1.1)",
    marginBottom: "1px solid #000",
  };

  return (
    <div style={mainContainer}>
      <div style={voltarContainer}>
        <Link 
        href={"/"}
        style={isHovered ? { ...btnVoltar, ...btnVoltarHover } : btnVoltar}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        >
          {/* <Image src={voltarLogo} alt="icone do instagram" width={30} /> */}
          Voltar
        </Link>
      </div>
      <div style={contentContainer}>
        <div style={cardContainer}>
          <h4 style={h4Style}>
            Projeto desenvolvido para campanha de HSE do mês de agosto, turma D,
            gemin.
          </h4>
          {/* <h5>A826408</h5> */}
        </div>
      </div>
    </div>
  );
}
