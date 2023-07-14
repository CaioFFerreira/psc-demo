// React core
import { useNavigate } from "react-router-dom";
import React from "react";

// Ant Design
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface BackPageProps {
  label: string;
  path: string;
}

const BackPage = ({ path, label }: BackPageProps) => {
  const navigate = useNavigate();

  return (
    <Button
      type="link"
      icon={<ArrowLeftOutlined />}
      className="p--0 mb--20 text--base"
      onClick={() => navigate(path)}
    >
      {label}
    </Button>
  );
};

export default BackPage;
