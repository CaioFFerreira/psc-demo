// React core
import React from "react";

// Components
import { Container } from "../../layout";
import Title from "../../components/shared/Title";
import Label from "../../components/shared/Label";
import { Actions, Filters } from "./style";

// Ant design
import {
  Button,
  Divider,
  Input,
  Tooltip,
  Form,
  Modal,
  Table,
  Tag,
  Popconfirm,
  Checkbox,
  Row,
  Col,
  Switch,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// Services
import api from "../../services/api";
import { formatDate } from "../../utils/formatDate";
import useNotification from "../../hooks/useNotification";

const Users = () => {
  const { openNotificationWithIcon, contextHolder } = useNotification();

  // States
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [filterName, setFilterName] = React.useState("");
  const [user, setUser] = React.useState<any>({});
  const [formModal, setFormModal] = React.useState<any>({
    title: "",
    paragraph: "",
  });

  const [showFieldPassword, setShowFieldPassword] = React.useState(true);
  const [requiredPassword, setRequiredPassword] = React.useState(true);

  const [disabledActive, setDisabledActive] = React.useState(false);

  const [form] = Form.useForm();

  const [mode, setMode] = React.useState("");

  const columns: any = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Data de Inclusão",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (_: any, { dateCreated }: any) => {
        return formatDate(dateCreated);
      },
    },
    {
      title: "Permissão",
      dataIndex: "idPerfil",
      key: "idPerfil",
      render: (_: any, { idPerfil }: any) => {
        const permissions: any = {
          0: "Administrador",
          1: "Padrão",
        };
        return permissions[idPerfil];
      },
    },

    {
      title: "Status",
      dataIndex: "ativo",
      key: "ativo",
      render: (_: any, record: any) =>
        record.ativo ? (
          <Tag color="green">Ativo</Tag>
        ) : (
          <Tag color="red">Inativo</Tag>
        ),
    },
    {
      title: "Ação",
      key: "action",
      width: 100,
      render: (_: any, record: any) => (
        <Actions>
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal("edit", record)}
            />
          </Tooltip>
          <Popconfirm
            placement="topRight"
            title="Excluir"
            description="Deseja excluir esse usuário?"
            onConfirm={() => deleteUser(record.usuarioId)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{ loading: loadingDelete }}
            icon={<DeleteOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Excluir">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Actions>
      ),
    },
  ];

  const showModal = (modeParams: string, record: any) => {
    setIsModalOpen(true);
    setMode(modeParams);

    if (modeParams === "create") {
      setDisabledActive(true);
      setRequiredPassword(true);
      setFormModal({
        title: "Novo usuário",
        paragraph: "Preencha os campos abaixo para criar um novo usuário",
      });

      form.setFieldsValue({
        username: "",
        email: "",
        newPassword: "",
        passwordConfirmation: "",
        active: true,
        permission: false,
      });
    }

    if (modeParams === "edit") {
      setDisabledActive(false);
      setShowFieldPassword(false);
      setRequiredPassword(false);
      setUser(record);
      setFormModal({
        title: "Editar usuário",
        paragraph: "Preencha os campos abaixo para editar o usuário",
      });

      form.setFieldsValue({
        username: record.nome,
        email: record.email,
        active: record.ativo,
        permission: record.idPerfil === 0 ? true : false,
      });
    }
  };

  const alterPassword = (checked: boolean) => {
    setShowFieldPassword(checked);
    checked ? setRequiredPassword(true) : setRequiredPassword(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setShowFieldPassword(true);

    form.setFieldsValue({
      username: "",
      email: "",
      newPassword: "",
      passwordConfirmation: "",
    });
  };

  const onFinish = (value: any) => {
    if (mode === "create") {
      setLoadingUser(true);
      api
        .post("/price/user", {
          nome: value.username,
          email: value.email,
          senha: value.newPassword,
          ativo: true,
          idPerfil: value.permission ? 0 : 1,
        })
        .then(() => {
          handleCancel();
          openNotificationWithIcon({
            type: "success",
            title: "Usuário criado",
            description: "O usuário foi criado com sucesso!",
          });
        })
        .catch(({ response }) => {
          if (response.data?.errors[0] === "E-mail já cadastrado") {
            openNotificationWithIcon({
              type: "error",
              title: "Erro ao criar usuário",
              description: "O e-mail informado já está cadastrado!",
            });

            return;
          }
          openNotificationWithIcon({
            type: "error",
            title: "Erro ao criar usuário",
            description: "Ocorreu um erro ao criar o usuário, tente novamente!",
          });
        })
        .finally(() => {
          getUsers("");
          setLoadingUser(false);
        });
    }

    if (mode === "edit") {
      setLoadingUser(true);
      api
        .patch(`/price/user`, {
          usuarioId: user?.usuarioId,
          nome: value.username,
          email: value.email,
          ativo: value.active,
          senha: value.newPassword,
          trocaSenha: true,
          idPerfil: value.permission ? 0 : 1,
        })
        .then(() => {
          handleCancel();
          openNotificationWithIcon({
            type: "success",
            title: "Usuário editado",
            description: "O usuário foi editado com sucesso!",
          });
        })
        .catch((err) => {
          if (err.response.data.statusCode === "409") {
            openNotificationWithIcon({
              type: "error",
              title: "Erro ao editar usuário",
              description: "O e-mail informado já está cadastrado!",
            });
            return;
          }
          openNotificationWithIcon({
            type: "error",
            title: "Erro ao editar usuário",
            description:
              "Ocorreu um erro ao editar o usuário, tente novamente!",
          });
        })
        .finally(() => {
          getUsers("");
          setLoadingUser(false);
        });
    }
  };

  const deleteUser = (id: number) => {
    setLoadingDelete(true);
    api
      .delete(`/price/user/${id}`)
      .then(() => {
        openNotificationWithIcon({
          type: "success",
          title: "Usuário deletado",
          description: "O usuário foi deletado com sucesso!",
        });
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao deletar usuário",
          description: "Ocorreu um erro ao deletar o usuário, tente novamente!",
        });
      })
      .finally(() => {
        setLoadingDelete(false);
        getUsers("");
      });
  };

  const getUsers = (filterName: string) => {
    setLoading(true);
    api
      .get(`/price/user?nome=${filterName}`)
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao obter usuários",
          description: "Ocorreu um erro ao obter os usuários, tente novamente!",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getUsers(filterName);
  }, []);

  const clearFilters = () => {
    setFilterName("");
    getUsers("");
  };

  return (
    <Container>
      {contextHolder}
      <Title title="Usuários" paragraph="Visualize, edite e crie usuários" />
      <div className="text--right">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal("create", null)}
        >
          Novo usuário
        </Button>
      </div>

      <Divider orientation="left">Filtro</Divider>

      <Filters className="mb--20">
        <Label label="Nome">
          <Input
            value={filterName}
            onChange={({ target }) => setFilterName(target.value)}
          />
        </Label>

        <Tooltip title="Buscar">
          <Button type="primary" onClick={() => getUsers(filterName)}>
            <SearchOutlined />
          </Button>
        </Tooltip>

        <Button type="link" onClick={clearFilters}>
          Limpar filtro
        </Button>
      </Filters>

      <Table
        locale={{ emptyText: "Sem usuários" }}
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="usuarioId"
      />

      <Modal open={isModalOpen} footer={null} onCancel={handleCancel}>
        <Title title={formModal?.title} paragraph={formModal?.paragraph} />
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Informe um e-mail!", type: "email" },
            ]}
          >
            <Input
              placeholder="exemplo@fleetbrasil.com.br"
              autoComplete="off"
            />
          </Form.Item>

          {mode === "edit" && (
            <Form.Item label="Alterar senha" valuePropName="checked">
              <Switch onChange={alterPassword} />
            </Form.Item>
          )}

          {showFieldPassword && (
            <>
              <Form.Item
                name="newPassword"
                label="Senha"
                rules={[
                  {
                    required: requiredPassword,
                    message: "Informe uma senha!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="1234"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                name="passwordConfirmation"
                label="Confirmação de senha"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: requiredPassword,
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
            </>
          )}

          <Row>
            <Col span={8}>
              <Form.Item name="active" valuePropName="checked">
                <Checkbox disabled={disabledActive}>Usuário ativo?</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="permission" valuePropName="checked">
                <Checkbox>Administrador</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="mt--15"
              loading={loadingUser}
            >
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default Users;
