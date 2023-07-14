import React from "react";
import BackPage from "../../components/shared/BackPage";

const ErrorPage = () => {
  return (
    <section>
      <BackPage path="/" label="Voltar" />

      <h2 className="text--xl text--black">Página não encontrada</h2>
    </section>
  );
};

export default ErrorPage;
