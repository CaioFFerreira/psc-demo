import React from "react";

// Ant design
import { Button, Drawer, Form, Input, Spin, message } from "antd";

// User context
import { UserContextType } from "../../contexts/UserContextType";
import { UserContext } from "../../contexts/UserContext";

// Hooks
import useNotification from "../../hooks/useNotification";

// Services
import api from "../../services/api";

const Profile = ({ open, setOpen }: any) => {
  const { data, userLogout } = React.useContext<UserContextType>(UserContext);
  const { openNotificationWithIcon, contextHolder } = useNotification();

  const [messageApi, contextHolderMessage] = message.useMessage();

  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [loadingGetUser, setLoadingGetUser] = React.useState(false);
  const [user, setUser] = React.useState<any>({});

  const onFinish = (value: any) => {
    setLoading(true);
    api
      .patch(`/price/user`, {
        usuarioId: user?.usuarioId,
        nome: value.username,
        email: user?.email,
        ativo: user?.ativo,
        senha: value.newPassword,
        idPerfil: user?.idPerfil,
      })
      .then(() => {
        setOpen(false);

        messageApi.open({
          type: "success",
          content:
            "Voce será redirecionado para a tela de login para efetuar a autenticação novamente!",
          duration: 5,
        });
        setTimeout(() => {
          userLogout();
        }, 5000);
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao editar usuário",
          description: "Ocorreu um erro ao editar o usuário, tente novamente!",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (open) {
      setLoadingGetUser(true);
      api
        .get(`/price/user/${data?.userId}`)
        .then(({ data }) => {
          setUser(data);
          form.setFieldsValue({
            username: data.nome,
          });
        })
        .catch(() => {
          setOpen(false);
          openNotificationWithIcon({
            type: "error",
            title: "Erro ao buscar perfil",
            description: "Ocorreu um erro ao buscar o perfil, tente novamente!",
          });
        })
        .finally(() => {
          setLoadingGetUser(false);
        });
    }
  }, [setOpen, open, data?.userId, form]);

  return (
    <Drawer
      title="Editar Perfil"
      placement="right"
      onClose={() => setOpen(false)}
      open={open}
    >
      {contextHolder} {contextHolderMessage}
      <Spin spinning={loadingGetUser} size="large">
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Nome"
            name="username"
            rules={[{ required: true, message: "Informe um nome!" }]}
          >
            <Input placeholder="Exemplo" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nova senha"
            rules={[
              {
                required: true,
                message: "Informe uma senha!",
              },
            ]}
          >
            <Input.Password placeholder="1234" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            name="passwordConfirmation"
            label="Confirmação da nova senha"
            dependencies={["newPassword"]}
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
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default Profile;
