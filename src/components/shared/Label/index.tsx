// React core
import React from "react";

interface LabelProps {
  label: string;
  children: React.ReactNode;
}

const Label = (props: LabelProps) => {
  return (
    <div style={{ width: "100%" }}>
      <label className="pb--5 text--sm text--black">{props.label}</label>
      {props.children}
    </div>
  );
};

export default Label;
