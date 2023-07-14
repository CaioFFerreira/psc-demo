import React from "react";
import { OrderStatusStorage } from "./OrderStatusContext";
import StepsPage from "./StepsPage";

const OrderStatus = () => {
  return (
    <OrderStatusStorage>
      <StepsPage />
    </OrderStatusStorage>
  );
};

export default OrderStatus;
