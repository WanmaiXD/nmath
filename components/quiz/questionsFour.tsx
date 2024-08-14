"use client";

import React, { useState } from "react";

const Question = ({ name, choices }: { name: string; choices: string[] }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-sm mx-auto">
      <h3 className="text-lg font-semibold mb-4">{name}</h3>
      <ul className="space-y-2">
        {choices.map((choice, index) => (
          <li
            key={index}
            className={`p-2 border rounded-md cursor-pointer ${
              selectedChoice === choice
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleChoiceClick(choice)}
          >
            {choice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
