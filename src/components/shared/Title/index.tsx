import React from "react";

interface TitleProps {
  title: string;
  paragraph?: string;
}

const Title = ({ title, paragraph }: TitleProps) => {
  return (
    <div className="pb--40 text--left">
      <h1 className="text--2xl text--black pb--5">{title}</h1>
      {paragraph && <p className="text--base text--black">{paragraph}</p>}
    </div>
  );
};

export default Title;
