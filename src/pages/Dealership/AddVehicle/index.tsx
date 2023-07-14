// React core
import React from "react";

// Ant Design
import {
  AutoComplete,
  Button,
  Card,
  Divider,
  Input,
  InputNumber,
  Popconfirm,
  Table,
} from "antd";
import { CarOutlined, DeleteOutlined } from "@ant-design/icons";

// Components
import Title from "../../../components/shared/Title";
import Label from "../../../components/shared/Label";
import { Fields } from "./style";

// Dealership context and utils functions
import { DealershipContext } from "../DealershipContext";
import formatMoneyMask from "../../../utils/formatMoneyMask";
import formatValue from "../../../utils/formatValue";
import { AutoCompleteData, Options } from "./models/AddVehicleType";

// Services
import api from "../../../services/api";

const INITIAL_FIELDS = {
  preOrderBrandName: null,
  preOrderBrandId: null,
  name: null,
  quantity: null,
  deadline: null,
  km: null,
  costMonthly: "",
} as any;

const INITIAL_AUTOCOMPLETE = {
  brands: [],
  models: [],
};

const INITIAL_OPTIONS = {
  brands: [],
  models: [],
};

const AddVehicle = () => {
  const columns = [
    {
      title: "Montadora",
      dataIndex: "preOrderBrandName",
      key: "preOrderBrandName",
    },
    {
      title: "Modelo",
      dataIndex: "name",
      key: "name",
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
    {
      title: "Ação",
      key: "action",
      render: (record: any) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => removeVehicle(record)}
        >
          Remover
        </Button>
      ),
    },
  ];

  // States
  const { addVehicle, vehicles, removeVehicle, next } =
    React.useContext(DealershipContext);
  const [fields, setFields] = React.useState(INITIAL_FIELDS);
  const [autocompleteData, setAutocompleteData] =
    React.useState<AutoCompleteData>(INITIAL_AUTOCOMPLETE);
  const [options, setOptions] = React.useState<Options>(INITIAL_OPTIONS);

  const [buttonAddVehicleVisibility, setButtonAddVehicleVisibility] =
    React.useState(true);

  // Methods
  const transformCostMonthly = (value: string) => {
    const costMonthlyValidade =
      value.includes(",") && value.includes(".")
        ? value.replace(".", "").replace(",", ".")
        : value.replace(",", ".");

    return Number(costMonthlyValidade);
  };

  const handleChange = (name: string, value: any) => {
    if (name === "costMonthly") {
      value = formatMoneyMask(value);
    }
    setFields({ ...fields, [name]: value });
  };

  const handleSearch = (
    searchText: string,
    name: keyof typeof autocompleteData
  ) => {
    if (!searchText) return;

    const found = autocompleteData[name].filter((item) =>
      item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
    );

    setOptions({ ...options, [name]: !searchText ? [] : found });
  };

  const handleChangeBrand = (option: any) => {
    const brand = autocompleteData.brands.find((item) => item.name === option);

    setFields({
      ...fields,
      preOrderBrandId: brand?.preOrderBrandId,
      preOrderBrandName: brand?.name,
    });
  };

  const handleChangeModel = (value: string) => {
    setFields((prevState: any) => ({
      ...prevState,
      name: value,
    }));
    setOptions((prevState) => ({
      ...prevState,
      models: [],
    }));
  };

  const calculateTotal = () => {
    const result =
      transformCostMonthly(fields.costMonthly) *
      Number(fields.deadline) *
      Number(fields.quantity);
    return result;
  };

  const addVehicleItem = () => {
    addVehicle({
      ...fields,
      costMonthly: transformCostMonthly(fields.costMonthly),
      total: Number(calculateTotal().toFixed(2)),
    });
    setFields(INITIAL_FIELDS);
  };

  const getBrands = () => {
    api.get("/offers/preorders/brands").then(({ data }) => {
      setAutocompleteData((prevState) => ({ ...prevState, brands: data }));
    });
  };

  // Effects
  React.useEffect(() => {
    getBrands();
  }, []);

  React.useEffect(() => {
    if (fields.preOrderBrandId) {
      api
        .get(`/offers/preorders/modelsname/${fields.preOrderBrandId}`)
        .then(({ data }) => {
          setAutocompleteData((prevState) => ({ ...prevState, models: data }));
        });
    }
  }, [fields.preOrderBrandName]);

  React.useEffect(() => {
    const { preOrderBrandId, costMonthly, deadline, km, name, quantity } =
      fields;

    if (preOrderBrandId && costMonthly && deadline && km && name && quantity) {
      setButtonAddVehicleVisibility(false);
    } else {
      setButtonAddVehicleVisibility(true);
    }
  }, [fields]);

  return (
    <div>
      <Title
        title="Escolha do veículo"
        paragraph="Preencha os dados abaixo para realizar a reserva do veículo:"
      />

      <Divider orientation="center">Adicionar Veículo</Divider>
      <Card bordered={false}>
        <Fields>
          <Label label="Montadora">
            <AutoComplete
              value={fields.preOrderBrandName}
              onChange={(option) => handleChangeBrand(option)}
              onSearch={(searchText) => handleSearch(searchText, "brands")}
              style={{ width: "100%" }}
              placeholder="Chevrolet"
            >
              {options.brands.map(({ name, preOrderBrandId }) => (
                <AutoComplete.Option
                  key={`${name}-${preOrderBrandId}`}
                  value={name}
                >
                  {name}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Label>

          <Label label="Modelo">
            <AutoComplete
              value={fields.name}
              onSearch={(searchText) => handleSearch(searchText, "models")}
              placeholder="Modelo"
              style={{ width: "100%" }}
              onChange={(option) => handleChangeModel(option)}
            >
              {options.models.map(({ name, preOrderBrandId }) => (
                <AutoComplete.Option
                  key={`${name}-${preOrderBrandId}`}
                  value={name}
                >
                  {name}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Label>
          <Label label="Quantidade">
            <InputNumber
              min="0"
              controls={false}
              precision={0}
              maxLength={6}
              style={{ width: "100%" }}
              value={fields.quantity}
              onChange={(value) => handleChange("quantity", value)}
              placeholder="2"
            />
          </Label>
          <Label label="Prazo">
            <InputNumber
              min="0"
              max="999"
              style={{ width: "100%" }}
              maxLength={3}
              addonBefore="Meses"
              controls={false}
              placeholder="12"
              value={fields.deadline}
              onChange={(value) => handleChange("deadline", value)}
            />
          </Label>

          <Label label="Mensal">
            <InputNumber
              min="0"
              max="100000"
              style={{ width: "100%" }}
              maxLength={6}
              addonBefore="Km"
              controls={false}
              value={fields.km}
              placeholder="1000"
              onChange={(value) => handleChange("km", value)}
            />
          </Label>

          <Label label="Valor unitário">
            <Input
              min="0"
              style={{ width: "100%" }}
              maxLength={10}
              addonBefore="R$"
              value={fields.costMonthly}
              onChange={({ target }) =>
                handleChange("costMonthly", target.value)
              }
            />
          </Label>
        </Fields>
      </Card>

      <div className="text--right pt--20">
        <Button
          type="primary"
          onClick={addVehicleItem}
          disabled={buttonAddVehicleVisibility}
        >
          Adicionar veículo
        </Button>
      </div>

      <Divider orientation="center">Veículos Adicionados</Divider>

      <Table
        rowKey={(record) => {
          return record.name + record.preOrderBrandName + record.total;
        }}
        dataSource={vehicles}
        columns={columns}
        pagination={false}
        locale={{ emptyText: "Sem veículos" }}
      />

      <div className="text--right pt--20">
        <Popconfirm
          icon={<CarOutlined style={{ color: "#1677ff" }} />}
          title="Adicionar veiculos ?"
          description="não será mais possivel adicionar ou remover."
          onConfirm={() => next()}
          okText="Confirmar"
          cancelText="Não"
          placement="topRight"
          disabled={!vehicles.length}
        >
          <Button type="primary" disabled={!vehicles.length}>
            Continuar
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default AddVehicle;
