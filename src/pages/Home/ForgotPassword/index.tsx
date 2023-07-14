import React from "react";
import { Input, Button, Form } from "antd";
import api from "../../../services/api";
import BackPage from "../../../components/shared/BackPage";
import useNotification from "../../../hooks/useNotification";
import { FormDataType } from "./models/FormDataType";

const ForgotPassword = () => {
  const [loading, setLoading] = React.useState(false);
  const { openNotificationWithIcon, contextHolder } = useNotification();

  function onFinish({ email }: FormDataType) {
    setLoading(true);

    api
      .post("/price/user/resetpassword", {
        webSiteUrl: window.location.origin,
        email,
      })
      .then(() => {
        openNotificationWithIcon({
          type: "success",
          title: "Sucesso ao recuperar senha!",
          description:
            "Enviamos um link para o seu e-mail para redefinição de senha.",
        });
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao recuperar senha!",
          description: "Ocorreu um erro ao recuperar senha, tente novamente.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <section>
      {contextHolder}
      <BackPage path="/" label="Voltar para login" />
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Informe um e-mail!", type: "email" },
          ]}
        >
          <Input placeholder="exemplo@fleetbrasil.com.br" />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            className="mt--15"
            loading={loading}
          >
            Recuperar senha
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default ForgotPassword;
