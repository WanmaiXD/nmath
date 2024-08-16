import React from "react";
import { CircleX, CircleCheck } from "lucide-react";

export default function CounterCard() {
  return (
    <div>
      <div className="flex flex-row items-start pt-1 px-4 rounded-md">
        <div className="flex flex-row items-center">
          <CircleCheck size={24} />
          <div className="ml-2">12</div>
        </div>

        <div className="pl-3 flex flex-row items-center">
          <CircleX size={24} />
          <div className="ml-2">24</div>
        </div>
      </div>
    </div>
  );
}
