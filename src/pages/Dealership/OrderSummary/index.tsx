// React core
import React from "react";
import { useNavigate } from "react-router-dom";

// Ant Design
import { Button, Card, Divider, Input, Table } from "antd";

// Dealership context and utils functions
import { DealershipContext } from "../DealershipContext";
import { formatCnpj } from "../../../utils/formatCnpj";
import { formatCpfMask } from "../../../utils/formatCpfMask";
import { maskPhoneFormat } from "../../../utils/formatPhoneMask";
import { columns } from "./columnsData";
import useNotification from "../../../hooks/useNotification";

// Services
import api from "../../../services/api";

// Components
import Title from "../../../components/shared/Title";
import { Cards } from "./style";
import Resume from "../../../components/shared/Resume";

const OrderSummary = () => {
  const { openNotificationWithIcon, contextHolder } = useNotification();
  const navigate = useNavigate();
  const { vehicles, registrationUser, prev } =
    React.useContext(DealershipContext);
  const [observation, setObservation] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const sendOrder = () => {
    setLoading(true);
    api
      .post("/price/preorder", {
        items: vehicles,
        notes: observation,
        userId: parseInt(registrationUser.userId),
      })
      .then(({ data }) => {
        navigate(`/order-status/${data.preOrderId}`);
      })
      .catch((err) => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao criar pedido",
          description: "Erro ao criar pedido, tente novamente mais tarde",
        });
      })
      .finally(() => {
        setLoading(false);
        setObservation("");
      });
  };
  return (
    <div>
      {contextHolder}
      <Title
        title="Resumo do pedido"
        paragraph="Aqui você encontra todas as informações sobre o seu pedido"
      />

      <Cards className="mb--20">
        <Card title="Dados da empresa" bordered={false}>
          <p className="text--sm pb--10 text--black">
            <strong>CNPJ: </strong>
            {formatCnpj(registrationUser.cnpj) || "---"}
          </p>
          <p className="text--sm text--black">
            <strong>Razão Social: </strong>
            {registrationUser.companyName || "---"}
          </p>
        </Card>

        <Card title="Contato da empresa" bordered={false}>
          <p className="text--sm pb--10 text--black">
            <strong>Nome: </strong>
            {registrationUser.contactName || "---"}
          </p>

          <p className="text--sm pb--10 text--black">
            <strong>CPF: </strong>
            {formatCpfMask(registrationUser.cpf) || "---"}
          </p>

          <p className="text--sm pb--10 text--black">
            <strong>Telefone: </strong>
            {maskPhoneFormat(registrationUser.phone) || "---"}
          </p>

          <p className="text--sm text--black">
            <strong>E-mail: </strong>
            {registrationUser.mail || "---"}
          </p>
        </Card>
      </Cards>

      <Table
        rowKey={(record) => {
          return record.name + record.preOrderBrandName + record.total;
        }}
        dataSource={vehicles}
        columns={columns}
        pagination={false}
      />

      <Divider orientation="center">Resumo</Divider>

      <Resume items={vehicles} />

      <Divider orientation="center">Observações</Divider>
      <Input.TextArea
        showCount
        className="pb--20"
        rows={4}
        maxLength={500}
        value={observation}
        onChange={({ target }) => setObservation(target.value)}
      />

      <div className="text--right pt--20">
        <Button onClick={() => prev()} className="mr--10">
          Voltar
        </Button>
        <Button type="primary" onClick={sendOrder} loading={loading}>
          Criar pedido
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
