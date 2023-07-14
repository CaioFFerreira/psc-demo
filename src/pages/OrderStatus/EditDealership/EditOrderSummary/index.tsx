import React from "react";
import useNotification from "../../../../hooks/useNotification";
import { OrderStatusContext } from "../../OrderStatusContext";
import api from "../../../../services/api";
import Title from "../../../../components/shared/Title";
import { Button, Card, Divider, Input, Table } from "antd";
import { formatCnpj } from "../../../../utils/formatCnpj";
import { Cards } from "./style";
import { formatCpfMask } from "../../../../utils/formatCpfMask";
import { maskPhoneFormat } from "../../../../utils/formatPhoneMask";
import { columns } from "./columnsData";
import Resume from "../../../../components/shared/Resume";

const EditOrderSummary = () => {
  const { openNotificationWithIcon, contextHolder } = useNotification();

  const { orderStatus, orderUserRegistration, prev, setCurrentPage } =
    React.useContext(OrderStatusContext);
  const [observation, setObservation] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const resendOrder = () => {
    setLoading(true);
    api
      .post(`/price/preorder/updatestatus`, {
        status: 18,
        notes: observation,
        preOrderId: orderStatus?.preOrderId,
      })
      .then(() => {
        setCurrentPage(0);
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao reenviar pedido",
          description: "Erro ao reenviar pedido, tente novamente.",
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
            {formatCnpj(orderUserRegistration.cnpj) || "---"}
          </p>
          <p className="text--sm text--black">
            <strong>Razão Social: </strong>
            {orderUserRegistration.companyName || "---"}
          </p>
        </Card>

        <Card title="Contato da empresa" bordered={false}>
          <p className="text--sm pb--10 text--black">
            <strong>Nome: </strong>
            {orderUserRegistration.contactName || "---"}
          </p>

          <p className="text--sm pb--10 text--black">
            <strong>CPF: </strong>
            {formatCpfMask(orderUserRegistration.cpf) || "---"}
          </p>

          <p className="text--sm pb--10 text--black">
            <strong>Telefone: </strong>
            {maskPhoneFormat(orderUserRegistration.phone) || "---"}
          </p>

          <p className="text--sm text--black">
            <strong>E-mail: </strong>
            {orderUserRegistration.mail || "---"}
          </p>
        </Card>
      </Cards>

      <Table
        rowKey={(record) => {
          return record.model + record.brand + record.total;
        }}
        dataSource={orderStatus.items}
        columns={columns}
        pagination={false}
      />

      <Divider orientation="center">Resumo</Divider>

      <Resume items={orderStatus.items} />

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
        <Button type="primary" onClick={resendOrder} loading={loading}>
          Concluir
        </Button>
      </div>
    </div>
  );
};

export default EditOrderSummary;
