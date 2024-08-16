import React from "react";
import { CircleX, CircleCheck } from "lucide-react";
import { useScore } from "./scoreContext";

export default function CounterCard() {
  const { correctChoices, wrongChoices } = useScore(); // context usage

  return (
    <div>
      <div className="flex flex-row items-start pt-1 px-4 rounded-md">
        <div className="flex flex-row items-center">
          <CircleCheck size={20} color="#22c55e" />
          <div className="ml-2">{correctChoices}</div>
        </div>

        <div className="pl-3 flex flex-row items-center">
          <CircleX size={20} color="#dc2626" />
          <div className="ml-2">{wrongChoices}</div>
        </div>
      </div>
    </div>
  );
}
