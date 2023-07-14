import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { columns } from "./columnsData";

// Icons
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

// Components ant
import {
  Table,
  Button,
  Input,
  Tooltip,
  Divider,
  Select,
  Pagination,
  PaginationProps,
} from "antd";
import { DataType } from "./models/DataType";
import Title from "../../components/shared/Title";

// Styles
import { Container } from "../../layout";
import { FilterTypes } from "./models/FilterTypes";
import { Filters } from "./style";
import Label from "../../components/shared/Label";
import { formatCnpj } from "../../utils/formatCnpj";
import useNotification from "../../hooks/useNotification";

const DefaultFilters = {
  status: 0,
  cpfCnpj: "",
  personType: "J",
  number: "",
  page: 1,
  pageSize: 10,
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [data, setData] = React.useState<{ data: DataType[]; count: number }>({
    data: [],
    count: 0,
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<FilterTypes>(DefaultFilters);

  const { openNotificationWithIcon, contextHolder } = useNotification();

  const setFiltersOnChange = (key: string, value: string | number) => {
    setFilters({ ...filters, [key]: value });
  };

  function navigationToAddOrder(): void {
    navigate("/dealership");
  }

  const getOrders = (filters: FilterTypes) => {
    setLoading(true);
    api
      .post("/price/preorder/search", {
        ...filters,
        status: filters.status === 0 ? null : filters.status,
        cpfCnpj: filters.cpfCnpj.replace(/\D+/g, ""),
        number: filters.number.toUpperCase(),
        page: filters.page,
        pageSize: filters.pageSize,
      })
      .then(({ data }) => {
        setData(data);
      })
      .catch((err) => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro ao exibir pedidos!",
          description: "Ocorreu um erro ao exibir pedidos, tente novamente.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearFilters = () => {
    setFilters(DefaultFilters);
    getOrders(DefaultFilters);
  };

  React.useEffect(() => {
    getOrders(filters);
  }, []);

  const onChange: PaginationProps["onChange"] = (page, pageSize) => {
    setFilters({ ...filters, page, pageSize });
    getOrders({ ...filters, page, pageSize });
  };

  const searchFilters = () => {
    setFilters({ ...filters, page: 1 });
    getOrders({ ...filters, page: 1 });
  };

  return (
    <Container>
      {contextHolder}
      <Title title="Meus pedidos" />
      <div className="text--right">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={navigationToAddOrder}
        >
          Novo pedido
        </Button>
      </div>

      <Divider orientation="left">Filtros</Divider>

      <Filters className="mb--20">
        <Label label="Status">
          <Select
            value={filters.status}
            onChange={(item) => setFiltersOnChange("status", Number(item))}
            style={{ width: "100%" }}
            options={[
              { value: 0, label: "Todos" },
              { value: 1, label: "Pedido Criado" },
              { value: 3, label: "Análise de Crédito" },
              { value: 6, label: "Crédito Aprovado" },
              { value: 7, label: "Crédito Reprovado" },
              { value: 8, label: "Refazer Pedido" },
              { value: 4, label: "Pedido Expirado" },
              { value: 5, label: "Pedido Cancelado" },
            ]}
          />
        </Label>
        <Label label="Documento">
          <Input
            placeholder="00.000.000/0000-00"
            value={formatCnpj(filters.cpfCnpj)}
            onChange={({ target }) =>
              setFiltersOnChange("cpfCnpj", target.value)
            }
          />
        </Label>
        <Label label="Pedido">
          <Input
            placeholder="SC00000"
            value={filters.number}
            maxLength={11}
            onChange={({ target }) =>
              setFiltersOnChange("number", target.value)
            }
          />
        </Label>

        <Tooltip title="Buscar">
          <Button
            type="primary"
            onClick={() => {
              searchFilters();
            }}
          >
            <SearchOutlined />
          </Button>
        </Tooltip>

        <Button type="link" onClick={clearFilters}>
          Limpar filtros
        </Button>
      </Filters>

      <Table
        rowKey="preOrderId"
        locale={{ emptyText: "Sem pedidos" }}
        columns={columns}
        dataSource={data?.data}
        loading={loading}
        pagination={false}
        onRow={({ preOrderId }) => {
          return {
            onClick: () => {
              navigate("/order-status/" + preOrderId);
            },
          };
        }}
      />

      <div className="mt--20">
        <Pagination
          showSizeChanger
          total={data?.count}
          current={filters.page}
          pageSize={filters.pageSize}
          onChange={onChange}
        />
      </div>
    </Container>
  );
};

export default MyOrders;
