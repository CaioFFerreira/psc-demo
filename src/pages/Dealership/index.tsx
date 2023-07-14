// React core
import React from "react";

// Layout
import { Container } from "../../layout";

// Dealership context
import { DealershipStorage } from "./DealershipContext";
import StepsDealership from "./StepsDealership";

const Dealership = () => {
  return (
    <DealershipStorage>
      <Container>
        <StepsDealership />
      </Container>
    </DealershipStorage>
  );
};

export default Dealership;
