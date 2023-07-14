import { Card } from "antd";
import React from "react";
import formatValue from "../../../utils/formatValue";

interface Item {
  brand: string;
  costMonthly: number;
  dateCreated: string;
  deadline: number;
  km: number;
  model: string;
  preOrderId: number;
  preOrderItemId: string;
  preOrderModelId: number;
  quantity: number;
  total: number;
}

interface OrderResume {
  limitCredit: number;
  greaterDeadline: number[];
  allInstallment: number[];
}

const Resume = (props: any) => {
  const formateOrderResume = () => {
    const orderItems = props?.items.reduce(
      (acc: any, item: Item) => {
        acc.limitCredit += item.total;
        acc.allInstallment.push(item.costMonthly * item.quantity);
        acc.greaterDeadline.push(item.deadline);
        return acc;
      },
      {
        greaterDeadline: [],
        allInstallment: [],
        limitCredit: 0,
      } as OrderResume
    );

    return {
      limitCredit: orderItems?.limitCredit,
      greaterDeadline: orderItems?.greaterDeadline.reduce(function (
        a: any,
        b: any
      ) {
        return Math.max(a, b);
      },
      -Infinity),
      allInstallment: orderItems?.allInstallment.reduce(
        (acc: any, item: any) => (acc += item)
      ),
    };
  };

  return (
    <Card bordered={false}>
      <p className="text--lg pb--10 text--black">
        <strong>Maior prazo: </strong>
        {formateOrderResume()?.greaterDeadline + " Meses"}
      </p>

      <p className="text--lg pb--10 text--black">
        <strong>Valor da parcela: </strong>
        {formatValue(Number(formateOrderResume()?.allInstallment))}
      </p>

      <p className="text--lg text--black">
        <strong>Limite de crédito solicitado: </strong>
        {formatValue(Number(formateOrderResume()?.limitCredit))}
      </p>
    </Card>
  );
};

export default Resume;
