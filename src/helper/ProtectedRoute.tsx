// React core
import React from "react";
import { Navigate } from "react-router-dom";

// User context
import { UserContext } from "../contexts/UserContext";
import { UserContextType } from "../contexts/UserContextType";

// Ant Design
import { Spin } from "antd";

const ProtectedRoute = ({ children, roles }: any) => {
  const { login, data } = React.useContext<UserContextType>(UserContext);

  return data ? (
    login && roles.includes(data?.profileId) ? (
      children
    ) : (
      <Navigate to="/" />
    )
  ) : login ? (
    <div className="text--center">
      <Spin size="large" />
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
