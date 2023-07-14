// React core
import React from "react";
import { useLocation } from "react-router-dom";

// Layout
import { Container } from "../../layout";

const Footer = () => {
  const { pathname } = useLocation();

  const routesShowFooter = ["my-orders", "dealership", "order-status", "users"];

  if (routesShowFooter.includes(pathname.split("/")[1])) {
    return (
      <div className="pt--20 pb--20 bg--primary mt--80">
        <Container>
          <footer className="text--center">
            <p className="text--white text--sm ">
              LM Soluções® Todos os direitos reservados
            </p>
          </footer>
        </Container>
      </div>
    );
  } else {
    return null;
  }
};

export default Footer;
