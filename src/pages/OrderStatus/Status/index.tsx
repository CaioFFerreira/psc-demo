import React from "react";

import { Card, Divider, Table, Button, Input, Skeleton } from "antd";

import { EditOutlined, PlusOutlined } from "@ant-design/icons";

import { useParams } from "react-router-dom";
import { Cards } from "./style";

import { columns, columnsNotes } from "./columnsData";
import useNotification from "../../../hooks/useNotification";
import api from "../../../services/api";
import { Container } from "../../../layout";
import BackPage from "../../../components/shared/BackPage";
import Title from "../../../components/shared/Title";
import { formatCpfMask } from "../../../utils/formatCpfMask";
import { maskPhoneFormat } from "../../../utils/formatPhoneMask";
import { formatCnpj } from "../../../utils/formatCnpj";
import Resume from "../../../components/shared/Resume";
import { OrderStatusContext } from "../OrderStatusContext";

const Status = () => {
  const { id } = useParams();

  const { openNotificationWithIcon, contextHolder } = useNotification();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [order, setOrder] = React.useState<any>();

  const [observation, setObservation] = React.useState<string>("");
  const [loadingNote, setLoadingNote] = React.useState(false);

  // Global state
  const { setCurrentPage, setOrderStatus } =
    React.useContext(OrderStatusContext);

  const getOrderStatus = () => {
    setLoading(true);
    api
      .get(`/price/preorder/${id}`)
      .then(({ data }) => {
        const { data: response } = data;
        setOrder(response);
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao exibir status do pedido!",
          description:
            "Ocorreu um erro ao exibir status do pedido, tente novamente.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addNotes = () => {
    setLoadingNote(true);
    api
      .post(`/price/preorder/updatestatus`, {
        status: 18,
        notes: observation,
        preOrderId: order?.preOrderId,
      })
      .then(() => {
        getOrderStatus();
      })
      .catch(({ response }) => {
        const {
          data: { data },
        } = response;

        openNotificationWithIcon({
          type: "error",
          title: "Erro ao adicionar nota!",
          description:
            data || "Ocorreu um erro ao adicionar nota, tente novamente.",
        });
      })
      .finally(() => {
        setLoadingNote(false);
        setObservation("");
      });
  };

  const editOrder = () => {
    setOrderStatus(order);
    setCurrentPage(1);
  };

  React.useEffect(() => {
    getOrderStatus();
  }, []);

  return (
    <Container>
      {contextHolder}
      <BackPage path="my-orders" label="Voltar para pedidos" />
      <Title
        title="Status do pedido"
        paragraph="Aqui você encontra todas as informações sobre o status do pedido."
      />
      <Cards className="mb--20">
        <Card title="Dados da empresa" bordered={false}>
          <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
            <p className="text--sm pb--10 text--black">
              <strong>CNPJ: </strong>

              {(order?.cpfCnpj && formatCnpj(order?.cpfCnpj)) || "---"}
            </p>
            <p className="text--sm text--black">
              <strong>Razão Social: </strong>
              {order?.name || "---"}
            </p>
          </Skeleton>
        </Card>

        <Card title="Contato da empresa" bordered={false}>
          <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
            <p className="text--sm pb--10 text--black">
              <strong>Nome: </strong>
              {order?.contatoNome || "---"}
            </p>

            <p className="text--sm pb--10 text--black">
              <strong>CPF: </strong>

              {(order?.contatoCPF && formatCpfMask(order?.contatoCPF)) || "---"}
            </p>

            <p className="text--sm pb--10 text--black">
              <strong>Telefone: </strong>
              {(order?.contatoPhone && maskPhoneFormat(order?.contatoPhone)) ||
                "---"}
            </p>

            <p className="text--sm text--black">
              <strong>E-mail: </strong>
              {order?.contatoEmail || "---"}
            </p>
          </Skeleton>
        </Card>
      </Cards>

      <Card
        className="mb--20"
        bordered={false}
        title="Dados do pedido"
        extra={
          order?.status === "PreOrderResend" &&
          order?.number.includes("SC") && (
            <Button type="primary" icon={<EditOutlined />} onClick={editOrder}>
              Ajustar pedido
            </Button>
          )
        }
      >
        <Skeleton
          loading={loading}
          active
          paragraph={{ rows: 1 }}
          className="mb--20"
        >
          <p className="text--sm pb--10 text--black">
            <strong>Número: </strong>
            {order?.number}
          </p>

          <p className="text--sm text--black mb--20">
            <strong>Status: </strong>
            {order?.statusDescription}
          </p>
        </Skeleton>
        <Table
          rowKey="preOrderObservationId"
          dataSource={order?.observacoes}
          columns={columnsNotes}
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "Sem observações" }}
          loading={loading}
        />

        {order?.status === "PreOrderResend" && order?.number.includes("SC") && (
          <div className="pt--15">
            <Input.TextArea
              showCount
              className="pb--20"
              maxLength={500}
              rows={4}
              value={observation}
              onChange={({ target }) => setObservation(target.value)}
            />

            <Button
              loading={loadingNote}
              type="primary"
              onClick={addNotes}
              icon={<PlusOutlined />}
              disabled={Boolean(!observation)}
            >
              Adicionar observação
            </Button>
          </div>
        )}
      </Card>

      <Table
        rowKey="model"
        dataSource={order?.items}
        columns={columns}
        pagination={false}
        loading={loading}
        locale={{ emptyText: "Sem items" }}
      />

      {order?.items && (
        <div>
          <Divider orientation="center">Resumo</Divider>
          <Resume items={order?.items} />
        </div>
      )}
    </Container>
  );
};

export default Status;
