import React from "react";

export const OrderStatusContext = React.createContext<any>({});

export const OrderStatusStorage = ({ children }: any) => {
  const [userId, setUserId] = React.useState<number>(0);
  const [orderStatus, setOrderStatus] = React.useState({});
  const [orderUserRegistration, setOrderUserRegistration] = React.useState({});

  const [currentEditStep, setCurrentEditStep] = React.useState(0);

  const [currentPage, setCurrentPage] = React.useState(0);

  const next = () => {
    setCurrentEditStep(currentEditStep + 1);
  };

  const prev = () => {
    setCurrentEditStep(currentEditStep - 1);
  };

  return (
    <OrderStatusContext.Provider
      value={{
        next,
        prev,
        currentEditStep,
        setCurrentEditStep,
        userId,
        setUserId,
        orderUserRegistration,
        setOrderUserRegistration,
        setOrderStatus,
        orderStatus,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </OrderStatusContext.Provider>
  );
};
