import Link from "next/link";
import "./index.css";

export default function Home() {
  return (
    <div className="container">
      <h1>Bem Vindo.</h1>
      <h4>Calcule os seus proventos mensais de forma fácil e rápido</h4>
      <div className="buttons-container">
        <Link href={"/perguntas"} className="button-container">
          Jogar
        </Link>
        <Link href={"/sobre"} className="button-container">
          Sobre
        </Link>
      </div>
    </div>
  );
}