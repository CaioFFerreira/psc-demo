import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import { ContainerHome, StyleAccess } from "./style";
import ResetPassword from "./ResetPassword";

import ImageLogoDark from "../../assets/images/logo-dark.png";
import ErrorPage from "../ErrorPage";
import { UserContextType } from "../../contexts/UserContextType";
import { UserContext } from "../../contexts/UserContext";

const Home = () => {
  const { login } = React.useContext<UserContextType>(UserContext);

  if (login) return <Navigate to="/my-orders" />;
  return (
    <ContainerHome>
      <div className="bg--img"></div>
      <StyleAccess>
        <div className="wrapper">
          <img src={ImageLogoDark} alt="logo" className="pb--20" />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </StyleAccess>
    </ContainerHome>
  );
};

export default Home;
