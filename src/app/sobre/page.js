import voltarLogo from "../../../public/back.png";
import Image from "next/image";
import Link from "next/link";
import "./index.css";

export default function About() {
  return (
    <div className="main-container">
      <div className="voltar-container">
        <Link href={"/"} className="btn-voltar">
          <Image src={voltarLogo} alt="icone do instagram" width={30} />
          Voltar
        </Link>
      </div>
      <div className="content-container">
        <div className="card-container">
          <h4>
            Projeto desenvolvido por{" "}
            <Link href={"https://www.instagram.com/m4theusrodrigues"} className="link">
              Matheus Rodrigues Vieira
            </Link>
            .
          </h4>
          <h5>
            A826408
          </h5>
        </div>
      </div>
    </div>
  );
}