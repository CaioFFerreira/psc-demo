import styled from "styled-components";

export const CnpjCard = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 2fr;

  .card__cnpj {
    width: 100%;
    max-width: 400px;
  }

  .card__form {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr;
  }
`;
