// React core
import React from "react";

// Components
import Title from "../../../components/shared/Title";
import { CnpjCard } from "./style";
import useNotification from "../../../hooks/useNotification";

// Ant Design
import { Button, Card, Divider, Form, Input, Select, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";

// Dealership context and utils functions
import { formatCnpj } from "../../../utils/formatCnpj";
import { DealershipContext } from "../DealershipContext";
import { formatCpfMask } from "../../../utils/formatCpfMask";
import { maskPhoneFormat } from "../../../utils/formatPhoneMask";
import { formatCepMask } from "../../../utils/formatCepMask";
import validateCnpj from "../../../utils/validateCnpj";
import { stateEnum, statesList } from "../../../enum/CepStates";

// Services
import api from "../../../services/api";

const Registration = () => {
  const { openNotificationWithIcon, contextHolder } = useNotification();

  const { next, setRegistrationUser } = React.useContext(DealershipContext);
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [loadingSearchCNPJ, setLoadingSearchCNPJ] = React.useState(false);
  const [loadingCEP, setLoadingCEP] = React.useState(false);
  const [validateStatus, setLoadingValidateStatus] =
    React.useState<any>(undefined);
  const [form] = Form.useForm();

  const [createNewUser, setCreateNewUser] = React.useState(false);
  const [userId, setUserId] = React.useState<number>(0);

  const removeAllCharacters = (value: string) => {
    return value.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "");
  };

  const searchCNPJ = ({ searchCNPJ }: any) => {
    const clearCnpj = searchCNPJ.replace(/[^\d]+/g, "");
    setLoadingSearchCNPJ(true);
    setLoadingValidateStatus("validating");
    setUserId(0);
    api
      .get(`/price/Company/${clearCnpj}`)
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

        setCreateNewUser(false);
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
      .catch((res: any) => {
        openNotificationWithIcon({
          type: "error",
          title: "Preencha os dados manualmente",
          description: "CNPJ não encontrado",
        });
        setCreateNewUser(true);
        form.setFieldsValue({
          cnpj: searchCNPJ,
          companyName: "",
          contactName: "",
          cpf: "",
          mail: "",
          phone: "",
          zipCode: "",
          street: "",
          number: "",
          district: "",
          complement: "",
          city: "",
          state: "",
        });
      })
      .finally(() => {
        setLoadingSearchCNPJ(false);
        setLoadingValidateStatus("");
      });
  };

  const registrationForm = (form: any) => {
    setLoadingForm(true);

    const methodSend = createNewUser ? "post" : "put";

    api?.[methodSend]("/price/company", {
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
        setRegistrationUser(res.data);
        next();
      })
      .catch(({ response }) => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao cadastrar!",
          description: "Ocorreu um erro ao cadastrar, tente novamente.",
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
        title="Cadastro de pessoa jurídica"
        paragraph="Preencha os dados abaixo para realizar a reserva do veículo:"
      />

      <CnpjCard>
        <div className="card__cnpj">
          <Card bordered={false}>
            <h4 className="text--xl">Pesquisar cliente</h4>
            <p className="text--sm pb--15">
              Digite o CNPJ para identificar um cliente Fleet
            </p>
            <Form layout="vertical" onFinish={searchCNPJ}>
              <Form.Item
                label="CNPJ"
                name="searchCNPJ"
                getValueFromEvent={({ target }) => formatCnpj(target.value)}
                rules={[
                  {
                    validator: (_, value) => {
                      if (value === "" || value === undefined) {
                        return Promise.reject(
                          new Error("Informe um CNPJ válido")
                        );
                      }

                      if (value.length < 18 || !validateCnpj(value)) {
                        return Promise.reject(new Error("CNPJ inválido"));
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="00.000.000/0000-00" />
              </Form.Item>
              <Button
                className="mt--10"
                type="primary"
                htmlType="submit"
                block
                loading={loadingSearchCNPJ}
              >
                Pesquisar
              </Button>
            </Form>
          </Card>
        </div>
        <Card bordered={false}>
          <Form layout="vertical" onFinish={registrationForm} form={form}>
            <Divider orientation="left">Dados da empresa</Divider>
            <div className="card__form ">
              <Form.Item
                label="CNPJ"
                name="cnpj"
                hasFeedback
                validateStatus={validateStatus}
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
                getValueFromEvent={({ target }) => formatCpfMask(target.value)}
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
                getValueFromEvent={({ target }) => formatCepMask(target.value)}
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
                <Button type="primary" htmlType="submit" loading={loadingForm}>
                  Concluir cadastro
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </CnpjCard>
    </div>
  );
};

export default Registration;
