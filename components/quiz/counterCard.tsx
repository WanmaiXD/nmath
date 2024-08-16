import React from "react";
import { CircleX, CircleCheck } from "lucide-react";
import { useScore } from "./scoreContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CounterCard() {
  const { correctChoices, wrongChoices } = useScore();

  const CounterNumber = ({ number, color }: { number: number, color: string }) => (
    <div className="ml-2 font-bold text-${color}-600">
      <AnimatePresence mode="wait">
        <motion.div
          key={number}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {number}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex flex-row items-start pt-1 px-4 rounded-md">
      <div className="flex flex-row items-center">
        <CircleCheck size={20} color="#22c55e" />
        <CounterNumber number={correctChoices} color="green" />
      </div>

      <div className="pl-3 flex flex-row items-center">
        <CircleX size={20} color="#dc2626" />
        <CounterNumber number={wrongChoices} color="red" />
      </div>
    </div>
  );
}
