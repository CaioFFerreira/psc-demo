import React from "react";
import { Input, Button, Form, Spin, Result } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { FormDataType } from "./models/FormDataType";
import BackPage from "../../../components/shared/BackPage";

const ResetPassword = () => {
  const { token } = useParams<any>();
  const [loading, setLoading] = React.useState(false);
  const [loadingCheckToken, setLoadingCheckToken] = React.useState(false);

  const [showResults, setShowResults] = React.useState(false);
  const [resultsCheck, setResultsCheck] = React.useState<any>({
    status: "",
    title: "",
    subTitle: "",
    path: {
      name: "",
      route: "",
    },
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    const checkToken = async () => {
      setLoadingCheckToken(true);
      await api
        .get("/price/user/checkpasswordresettoken", {
          params: {
            passwordResetToken: token,
          },
        })
        .then((res) => {
          if (!res.data.isValid) {
            setResultsCheck({
              status: "error",
              title: "Token expirado!",
              subTitle:
                "Solicite novamente a alteração de senha para o e-mail cadastrado",
              path: {
                name: "Reenviar recuperação de senha",
                route: "/forgot-password",
              },
            });
            setShowResults(true);
          }
        })
        .catch(() => {
          navigate("/");
        })
        .finally(() => {
          setLoadingCheckToken(false);
        });
    };
    checkToken();
  }, []);

  function onFinish({ newPassword }: FormDataType) {
    setLoading(true);

    api
      .post("/price/user/changepassword", {
        passwordResetToken: token,
        newPassword,
      })
      .then(() => {
        setResultsCheck({
          status: "success",
          title: "Senha alterada!",
          subTitle: "Sua senha foi definida com sucesso.",
          path: {
            name: "Fazer login",
            route: "/",
          },
        });
        setShowResults(true);
      })
      .catch(() => {
        setResultsCheck({
          status: "error",
          title: "Erro ao alterar a senha!",
          subTitle: "Ocorreu um erro ao alterar a senha, tente novamente.",
          path: {
            name: "Reenviar recuperação de senha",
            route: "/forgot-password",
          },
        });
        setShowResults(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <section>
      {showResults && (
        <Result
          status={resultsCheck?.status}
          title={resultsCheck?.title}
          subTitle={resultsCheck?.subTitle}
          extra={[
            <BackPage
              path={resultsCheck?.path.route}
              label={resultsCheck?.path.name}
            />,
          ]}
        />
      )}

      {!showResults && (
        <Spin spinning={loadingCheckToken} size="large">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="newPassword"
              label="Senha"
              rules={[
                {
                  required: true,
                  message: "Informe sua nova senha!",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="1234" />
            </Form.Item>

            <Form.Item
              name="passwordConfirmation"
              label="Confirmação de senha"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Confirme sua senha!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("A senha que você digitou não corresponde!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="1234" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                className="mt--15"
                loading={loading}
              >
                Redefinir senha
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      )}
    </section>
  );
};

export default ResetPassword;
