import React from "react";
import Status from "./Status";
import EditDealership from "./EditDealership";
import { OrderStatusContext } from "./OrderStatusContext";

const steps = [
  {
    content: <Status />,
  },
  {
    content: <EditDealership />,
  },
];

const StepsPage = () => {
  const { currentPage } = React.useContext(OrderStatusContext);

  return <section>{steps[currentPage].content}</section>;
};

export default StepsPage;
