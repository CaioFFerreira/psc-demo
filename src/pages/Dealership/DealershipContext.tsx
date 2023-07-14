import React from "react";
import { Car } from "./DealershipType";

export const DealershipContext = React.createContext<any>({});

export const DealershipStorage = ({ children }: any) => {
  // Vehicles Added
  const [vehicles, setVehicle] = React.useState<Car[]>([]);

  // Information after registered CNPJ user
  const [registrationUser, setRegistrationUser] = React.useState({});

  // Current step
  const [current, setCurrent] = React.useState(0);

  const addVehicle = (car: Car) => {
    setVehicle([...vehicles, car]);
  };

  const removeVehicle = (car: Car) => {
    const index = vehicles.indexOf(car);
    setVehicle(vehicles.filter((_, i) => i !== index));
  };

  // Next and prev steps
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <DealershipContext.Provider
      value={{
        vehicles,
        next,
        prev,
        addVehicle,
        removeVehicle,
        current,
        setCurrent,
        registrationUser,
        setRegistrationUser,
      }}
    >
      {children}
    </DealershipContext.Provider>
  );
};
