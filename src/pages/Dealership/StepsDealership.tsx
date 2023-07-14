// React core
import React from "react";

// Ant Design
import { Steps } from "antd";

// Components steps
import AddVehicle from "./AddVehicle";
import Registration from "./Registration";
import UploadDocuments from "./UploadDocuments";
import OrderSummary from "./OrderSummary";

// Dealership context
import { DealershipContext } from "./DealershipContext";

const steps = [
  {
    title: "Adicionar Veículo",
    content: <AddVehicle />,
  },
  {
    title: "Cadastro",
    content: <Registration />,
  },
  {
    title: "Carregar Documentos",
    content: <UploadDocuments />,
  },
  {
    title: "Resumo do pedido",
    content: <OrderSummary />,
  },
];

const StepsDealership = () => {
  const { current } = React.useContext(DealershipContext);

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <Steps current={current} items={items} className="pb--40" />
      <div>{steps[current].content}</div>
    </>
  );
};

export default StepsDealership;
