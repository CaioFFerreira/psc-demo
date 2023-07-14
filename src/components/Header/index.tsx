// React core
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

// Layout
import { Container } from "../../layout";
import ImageLogoLight from "../../assets/images/logo-light.png";
import { GridHeader } from "./style";
import Profile from "../../pages/Profile";

// Components Ant Design
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, MenuProps, Dropdown } from "antd";

// Context User
import { UserContext } from "../../contexts/UserContext";
import { UserContextType } from "../../contexts/UserContextType";

const Header = () => {
  const { data, userLogout } = React.useContext<UserContextType>(UserContext);
  const [open, setOpen] = React.useState(false);

  const items: MenuProps["items"] = [
    {
      label: "Perfil",

      onClick: () => {
        setOpen(true);
      },
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: <Link to="/my-orders">Meus Pedidos</Link>,
      key: "1",
    },
    [0].includes(data?.profileId)
      ? {
          label: <Link to="/users">Usuários</Link>,
          key: "2",
        }
      : null,

    {
      type: "divider",
    },
    {
      label: (
        <Button block icon={<LogoutOutlined />}>
          Sair
        </Button>
      ),
      onClick: () => {
        userLogout();
      },
      key: "3",
    },
  ];

  const { pathname } = useLocation();

  const routesShowHeader = ["my-orders", "dealership", "order-status", "users"];

  if (routesShowHeader.includes(pathname.split("/")[1])) {
    return (
      <header className="pt--20 pb--20 bg--primary mb--40">
        <Container>
          <GridHeader>
            <NavLink to="my-orders">
              <img src={ImageLogoLight} alt="LM Soluções" />
            </NavLink>

            <Profile open={open} setOpen={setOpen} />

            <div className="header__profile">
              {data?.userName && (
                <p className="text--sm text--white">{data?.userName} </p>
              )}

              <Dropdown menu={{ items }} trigger={["click"]}>
                <MenuOutlined className="text--white" />
              </Dropdown>
            </div>
          </GridHeader>
        </Container>
      </header>
    );
  } else {
    return null;
  }
};

export default Header;
