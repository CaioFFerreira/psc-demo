import { Steps } from "antd";
import React from "react";

import { OrderStatusContext } from "../OrderStatusContext";
import EditRegistration from "./EditRegistration";
import EditOrderSummary from "./EditOrderSummary";
import EditUploadDocuments from "./EditUploadDocuments";

const steps = [
  {
    title: "Editar Cadastro",
    content: <EditRegistration />,
  },
  {
    title: "Editar Documentos",
    content: <EditUploadDocuments />,
  },
  {
    title: "Resumo do pedido",
    content: <EditOrderSummary />,
  },
];

const StepsEditDealership = () => {
  const { currentEditStep } = React.useContext(OrderStatusContext);

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <Steps current={currentEditStep} items={items} className="pb--40" />
      <div>{steps[currentEditStep].content}</div>
    </>
  );
};

export default StepsEditDealership;
