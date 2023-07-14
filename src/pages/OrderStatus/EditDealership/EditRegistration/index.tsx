import React from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Spin,
  Tooltip,
} from "antd";

import { SendOutlined } from "@ant-design/icons";
import { OrderStatusContext } from "../../OrderStatusContext";
import useNotification from "../../../../hooks/useNotification";
import api from "../../../../services/api";
import { formatCnpj } from "../../../../utils/formatCnpj";
import Title from "../../../../components/shared/Title";
import { CardEditForm } from "./style";
import { formatCpfMask } from "../../../../utils/formatCpfMask";
import { maskPhoneFormat } from "../../../../utils/formatPhoneMask";
import { formatCepMask } from "../../../../utils/formatCepMask";
import { stateEnum, statesList } from "../../../../enum/CepStates";
import { useNavigate } from "react-router-dom";

const EditRegistration = () => {
  const { openNotificationWithIcon, contextHolder } = useNotification();

  const { next, setUserId, userId, setOrderUserRegistration, orderStatus } =
    React.useContext(OrderStatusContext);
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [loadingSearchCNPJ, setLoadingSearchCNPJ] = React.useState(false);
  const [loadingCEP, setLoadingCEP] = React.useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const removeAllCharacters = (value: string) => {
    return value.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "");
  };

  const fillData = (CNPJ: string) => {
    const clearCnpj = CNPJ.replace(/[^\d]+/g, "");

    setLoadingSearchCNPJ(true);
    api
      .get(`/price/company/${clearCnpj}`)
      .then(({ data }: any) => {
        const {
          cnpj,
          companyName,
          contactName,
          cpf,
          mail,
          phone,
          userId,
          address: {
            zipCode,
            number,
            city,
            state,
            street,
            district,
            complement,
          },
        } = data.value;

        setUserId(userId);

        form.setFieldsValue({
          cnpj: formatCnpj(cnpj),
          companyName,
          contactName,
          cpf: formatCpfMask(cpf),
          mail,
          phone: maskPhoneFormat(phone),
          zipCode: formatCepMask(zipCode),
          street,
          number,
          district,
          complement,
          city,
          state,
        });
      })
      .catch(() => {
        navigate(`/order-status/${userId}`);
      })
      .finally(() => {
        setLoadingSearchCNPJ(false);
      });
  };

  React.useEffect(() => {
    fillData(orderStatus.cpfCnpj);
  }, []);

  const registrationFormUpdate = (form: any) => {
    setLoadingForm(true);

    api
      .put("/price/company", {
        UserId: userId,
        address: {
          city: form.city,
          complement: form.complement,
          district: form.district,
          number: form.number,
          state: form.state,
          street: form.street,
          zipCode: removeAllCharacters(form.zipCode),
        },
        cnpj: removeAllCharacters(form.cnpj),
        companyName: form.companyName,
        contactName: form.contactName,
        cpf: removeAllCharacters(form.cpf),
        mail: form.mail,
        phone: removeAllCharacters(form.phone),
        quantityVehicules: 0,
        typeVehicule: 0,
      })
      .then((res) => {
        setOrderUserRegistration(res.data);
        next();
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao fazer update!",
          description:
            "Ocorreu um erro ao fazer update do CNPJ já cadastrado, tente novamente.",
        });
      })
      .finally(() => {
        setLoadingForm(false);
      });
  };

  const searchCep = (value: string) => {
    setLoadingCEP(true);

    api
      .get(`/ceps?cep=${removeAllCharacters(value)}`)
      .then(({ data }) => {
        openNotificationWithIcon({
          type: "success",
          title: "CEP encontrado!",
          description: "O CEP foi encontrado com sucesso",
        });

        form.setFieldsValue({
          street: data.logradouro,
          state: stateEnum[data.estado],
          city: data.localidade,
          district: data.bairro,
        });
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao buscar CEP!",
          description:
            "Ocorreu um erro ao buscar o CEP, digite manualmente ou tenta novamente.",
        });

        form.setFieldsValue({
          street: "",
          state: "",
          city: "",
          district: "",
        });
      })
      .finally(() => {
        setLoadingCEP(false);
      });
  };

  return (
    <div>
      {contextHolder}
      <Title
        title="Editar cadastro de pessoa jurídica"
        paragraph="Preencha os dados abaixo."
      />

      <Spin spinning={loadingSearchCNPJ} size="large">
        <CardEditForm>
          <Card bordered={false}>
            <Form
              layout="vertical"
              onFinish={registrationFormUpdate}
              form={form}
            >
              <Divider orientation="left">Dados da empresa</Divider>
              <div className="card__form ">
                <Form.Item
                  label="CNPJ"
                  name="cnpj"
                  rules={[
                    {
                      required: true,
                      message: "Informe um CNPJ válido",
                    },
                  ]}
                >
                  <Input disabled={true} placeholder="00.000.000/0000-00" />
                </Form.Item>

                <Form.Item
                  label="Razão social"
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: "Informe uma razão social",
                    },
                  ]}
                >
                  <Input placeholder="Nome da empresa" />
                </Form.Item>
              </div>

              <Divider orientation="left">Contato da empresa</Divider>
              <div className="card__form ">
                <Form.Item
                  label="Nome"
                  name="contactName"
                  rules={[
                    {
                      required: true,
                      message: "Informe um nome",
                    },
                  ]}
                >
                  <Input placeholder="Seu nome" />
                </Form.Item>

                <Form.Item
                  label="CPF"
                  name="cpf"
                  getValueFromEvent={({ target }) =>
                    formatCpfMask(target.value)
                  }
                  rules={[
                    {
                      required: true,
                      message: "Informe um CPF válido",
                    },
                  ]}
                >
                  <Input placeholder="00.000.000-00" />
                </Form.Item>
              </div>

              <div className="card__form ">
                <Form.Item
                  label="E-mail"
                  name="mail"
                  rules={[
                    {
                      required: true,
                      message: "Informe um e-mail",
                    },
                  ]}
                >
                  <Input placeholder="exemplo@fleetbrasil.com.br" />
                </Form.Item>

                <Form.Item
                  label="Telefone"
                  name="phone"
                  getValueFromEvent={({ target }) =>
                    maskPhoneFormat(target.value)
                  }
                  rules={[
                    {
                      required: true,
                      message: "Informe um telefone",
                    },
                  ]}
                >
                  <Input placeholder="(00) 00000-0000" />
                </Form.Item>
              </div>

              <Divider orientation="left">Endereço</Divider>
              <div className="card__form ">
                <Form.Item
                  label="CEP"
                  name="zipCode"
                  getValueFromEvent={({ target }) =>
                    formatCepMask(target.value)
                  }
                  rules={[
                    {
                      required: true,
                      message: "Informe um CEP",
                    },
                  ]}
                >
                  <Input.Search
                    placeholder="00000-000"
                    onSearch={searchCep}
                    loading={loadingCEP}
                    enterButton={
                      <Tooltip title="Preencher informações com o CEP">
                        <SendOutlined />
                      </Tooltip>
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Logradouro"
                  name="street"
                  rules={[
                    {
                      required: true,
                      message: "Informe um logradouro",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="card__form ">
                <Form.Item
                  label="Número"
                  name="number"
                  rules={[
                    {
                      required: true,
                      message: "Informe um número",
                    },
                  ]}
                >
                  <Input placeholder="Ex: 19" />
                </Form.Item>

                <Form.Item
                  label="Bairro"
                  name="district"
                  rules={[
                    {
                      required: true,
                      message: "Informe um bairro",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="card__form ">
                <Form.Item
                  label="Complemento"
                  name="complement"
                  rules={[
                    {
                      required: false,
                      message: "Informe um complemento",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Cidade"
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Informe uma cidade",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="card__form ">
                <Form.Item
                  label="Estado"
                  name="state"
                  rules={[
                    {
                      required: true,
                      message: "Informe um estado",
                    },
                  ]}
                >
                  <Select allowClear>
                    {statesList.map((state) => (
                      <Select.Option key={state.value} value={state.value}>
                        {state.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item className="pt--10">
                <div className="text--right pt--20">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadingForm}
                  >
                    Continuar
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </CardEditForm>
      </Spin>
    </div>
  );
};

export default EditRegistration;
