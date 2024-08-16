import React, { useEffect, useRef } from "react";
import { CircleX, CircleCheck } from "lucide-react";
import { useScore } from "./scoreContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CounterCard() {
  const { correctChoices, wrongChoices } = useScore();
  const prevCorrectChoices = useRef(correctChoices);
  const prevWrongChoices = useRef(wrongChoices);

  useEffect(() => {
    prevCorrectChoices.current = correctChoices;
  }, [correctChoices]);

  useEffect(() => {
    prevWrongChoices.current = wrongChoices;
  }, [wrongChoices]);

  const CounterNumber = ({
    number,
    color,
    shouldAnimate,
  }: {
    number: number;
    color: string;
    shouldAnimate: boolean;
  }) => (
    <div className={`ml-2 text-${color}-600`}>
      <AnimatePresence mode="wait">
        {shouldAnimate ? (
          <motion.div
            key={number}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {number}
          </motion.div>
        ) : (
          <div>{number}</div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex flex-row items-start pt-1 px-4 rounded-md">
      <div className="flex flex-row items-center">
        <CircleCheck size={20} color="#22c55e" />
        <CounterNumber
          number={correctChoices}
          color="green"
          shouldAnimate={correctChoices !== prevCorrectChoices.current}
        />
      </div>

      <div className="pl-3 flex flex-row items-center">
        <CircleX size={20} color="#dc2626" />
        <CounterNumber
          number={wrongChoices}
          color="red"
          shouldAnimate={wrongChoices !== prevWrongChoices.current}
        />
      </div>
    </div>
  );
}
