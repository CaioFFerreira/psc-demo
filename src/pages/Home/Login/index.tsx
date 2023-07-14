import React from "react";

import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContext";
import { UserContextType } from "../../../contexts/UserContextType";
import { FormDataType } from "./models/FormDataType";

const Login = () => {
  const navigate = useNavigate();

  const { userLogin, loading } = React.useContext<UserContextType>(UserContext);

  function navigationToForgotPassword() {
    navigate("/forgot-password");
  }

  async function onFinish({ username, password }: FormDataType) {
    userLogin(username, password);
  }

  return (
    <section>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email/CPF"
          name="username"
          rules={[
            { required: true, message: "Informe um e-mail!", type: "email" },
          ]}
        >
          <Input placeholder="exemplo@fleetbrasil.com.br" />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: "Informe uma senha!" }]}
        >
          <Input.Password placeholder="12345" />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            className="mt--15"
            loading={loading}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>

      <Button block type="link" onClick={navigationToForgotPassword}>
        Esqueci minha senha
      </Button>
    </section>
  );
};

export default Login;
