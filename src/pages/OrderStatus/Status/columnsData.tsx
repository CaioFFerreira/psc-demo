import { formatDate } from "../../../utils/formatDate";
import formatValue from "../../../utils/formatValue";

export const columnsNotes = [
  {
    title: "id",
    dataIndex: "preOrderObservationId",
    key: "preOrderObservationId",
  },
  {
    title: "Observação",
    dataIndex: "observacao",
    key: "observacao",
  },
  {
    title: "Data de criação",
    dataIndex: "dateCreated",
    key: "dateCreated",
    render: (_: any, { dateCreated }: any) => {
      return formatDate(dateCreated);
    },
    width: 200,
  },
];

export const columns = [
  {
    title: "Montadora",
    dataIndex: "brand",
    key: "brand",
  },
  {
    title: "Modelo",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "Quantidade",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Prazo",
    dataIndex: "deadline",
    key: "deadline",
    render: (deadline: number) => {
      return `${deadline} meses`;
    },
  },
  {
    title: "Km mensal",
    dataIndex: "km",
    key: "km",
  },
  {
    title: "Valor unitário",
    dataIndex: "costMonthly",
    key: "costMonthly",
    render: (costMonthly: number) => {
      return formatValue(costMonthly);
    },
  },
  {
    title: "Valor mensal",
    dataIndex: "costMonthly",
    key: "costMonthly",
    render: (_: any, record: any) => {
      return formatValue(record.costMonthly * record.quantity);
    },
  },
  {
    title: "Valor total",
    dataIndex: "total",
    key: "total",
    render: (total: number) => {
      return formatValue(total);
    },
  },
];
