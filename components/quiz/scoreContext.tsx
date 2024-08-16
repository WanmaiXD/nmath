"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ScoreContextType {
  correctChoices: number;
  wrongChoices: number;
  setCorrectChoices: React.Dispatch<React.SetStateAction<number>>;
  setWrongChoices: React.Dispatch<React.SetStateAction<number>>;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [correctChoices, setCorrectChoices] = useState(0);
  const [wrongChoices, setWrongChoices] = useState(0);

  return (
    <ScoreContext.Provider value={{ correctChoices, wrongChoices, setCorrectChoices, setWrongChoices }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};
