import React from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { UserContextType } from "./UserContextType";
import useNotification from "../hooks/useNotification";

export const UserContext = React.createContext<UserContextType>({
  userLogin: () => {},
  userLogout: () => {},
  loading: false,
  login: false,
  data: {},
});

export const getToken = () =>
  JSON.parse(window.localStorage.getItem("user") || "{}");

export const UserStorage = ({ children }: any) => {
  const navigate = useNavigate();

  const { openNotificationWithIcon, contextHolder } = useNotification();
  const dataLocalStorage = JSON.parse(
    window.localStorage.getItem("user") || "{}"
  );

  const [data, setData] = React.useState(null);
  const [login, setLogin] = React.useState(
    Boolean(dataLocalStorage?.accessToken)
  );
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (Boolean(dataLocalStorage?.accessToken)) {
      setLogin(true);
      setData(dataLocalStorage);
    }
  }, []);

  async function userLogin(username: string, password: string) {
    setLoading(true);
    api
      .post("/price/authentication/token", {
        username,
        password,
      })
      .then((res) => {
        window.localStorage.setItem("user", JSON.stringify(res.data));
        setData(res.data);
        setLogin(true);
        navigate("/my-orders");
      })
      .catch(({ response }) => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao fazer login",
          description: response?.data?.errors[0],
        });
        userLogout();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function userLogout() {
    setLogin(false);
    setData(null);
    setLoading(false);
    window.localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <UserContext.Provider
      value={{
        userLogin,
        userLogout,
        loading,
        data,
        login,
      }}
    >
      {/* contextHolder para mostrar a notificação */}
      {contextHolder}
      {children}
    </UserContext.Provider>
  );
};
