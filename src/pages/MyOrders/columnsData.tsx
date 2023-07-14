import type { ColumnsType } from "antd/es/table";
import { DataType } from "./models/DataType";
import { Badge, Tag } from "antd";

// Utils
import { formatDate } from "../../utils/formatDate";
import formatValue from "../../utils/formatValue";
import { formatCnpj } from "../../utils/formatCnpj";
import { statusColors } from "../../enum/StatusColors";
import { StatusContainer } from "./style";

export const columns: ColumnsType<DataType> = [
  {
    title: "Pedido",
    dataIndex: "number",
    key: "number",
    width: 120,
    render: (_, { number }) => {
      return <p className="text--sm">{number}</p>;
    },
  },
  {
    title: "Tipo",
    dataIndex: "personType",
    key: "personType",
    width: 100,
    render: (_, { personType }) => {
      return (
        <p className="text--sm">{personType === "J" ? "Jurídica" : "Física"}</p>
      );
    },
  },
  {
    title: "Nome/Razão Social",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Documento",
    dataIndex: "cpfCnpj",
    key: "cpfCnpj",
    render: (_, { cpfCnpj }) => {
      return (
        <div
          className="text--sm"
          style={{ wordWrap: "break-word", wordBreak: "break-word" }}
        >
          {formatCnpj(cpfCnpj)}
        </div>
      );
    },
  },
  {
    title: "Data de inclusão",
    dataIndex: "dateCreated",
    key: "dateCreated",
    width: 180,
    render: (_, { dateCreated }) => {
      return <p className="text--sm">{formatDate(dateCreated)}</p>;
    },
  },
  {
    title: "Valor total",
    dataIndex: "total",
    key: "total",
    width: 180,
    render: (_, { total }) => {
      return <p className="text--sm">{formatValue(total)}</p>;
    },
  },
  {
    title: "Status",
    dataIndex: "statusDescription",
    key: "statusDescription",
    render: (_, { statusDescription, status }) => (
      <StatusContainer>
        <Badge
          key={status}
          color={statusColors[status as keyof typeof statusColors]}
        />
        <p className="text--sm">{statusDescription}</p>
      </StatusContainer>
    ),
  },
];
