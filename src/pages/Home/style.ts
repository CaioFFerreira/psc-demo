import styled from "styled-components";

import BannerDefault from "../../assets/images/banner-default.png";

export const ContainerHome = styled.section`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  height: 100vh;

  .bg--img {
    background-image: url(${BannerDefault});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const StyleAccess = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;

  .wrapper {
    padding: 20px;
    width: 100%;
    max-width: 400px;
    min-height: 500px;

    img {
      width: 100%;
      max-width: 280px;
    }
  }
`;
