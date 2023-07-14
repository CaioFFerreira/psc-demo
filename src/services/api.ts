import axios from "axios";
import { getToken } from "../contexts/UserContext";

const api = axios.create({
  //baseURL: 'https://backend.vwsignanddrive.com.br/api' // PROD
  baseURL: "https://demhcnslkt3b9.cloudfront.net/api", // HML
});

api.interceptors.request.use(
  async function (config) {
    const user = await getToken();
    if (user?.accessToken) {
      config.headers.Authorization = `${user?.tokenType} ${user?.accessToken}`;
    }
    return config;
  },
  function (error) {
    if (error.response.status === 401) {
      window.localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (res) {
    const { status } = res;

    if (
      status === 200 ||
      status === 401 ||
      status === 201 ||
      status === 409 ||
      status === 404 ||
      status === 422 ||
      status === 204
    ) {
      return res;
    } else {
      console.error(
        "Ocorreu um erro ao processar a solicitação, tente novamente mais tarde"
      );
    }
    return res;
  },
  function (error) {
    if (error.response.status === 401) {
      window.localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
