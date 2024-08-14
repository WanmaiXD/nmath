"use client";

import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  choices: {
    [key: string]: string;
  };
  correctAnswer: string;
}

const QuestionRandomizer: React.FC = () => {
  const [questionData, setQuestionData] = useState<Question | null>(null);

  useEffect(() => {
    fetch("/data/choiceQuestions.json")
      .then((response) => response.json())
      .then((data) => {
        const randomQuestion = data.questions[
          Math.floor(Math.random() * data.questions.length)
        ] as Question;
        setQuestionData(randomQuestion);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const handleChoiceClick = (choiceKey: string) => {
    if (questionData) {
      const isCorrect = questionData.correctAnswer === choiceKey;
      console.log(isCorrect ? "correct choice" : "incorrect choice");
    }
  };

  if (!questionData) {
    return <div className="text-center">Loading questions</div>;
  }

  return (
    <div className="p-4 border rounded-md">
      <p className="text-lg mb-4">{questionData.question}</p>
      <ul className="space-y-2">
        {Object.entries(questionData.choices).map(([key, value]) => (
          <li
            key={key}
            className="p-2 border rounded-md cursor-pointer bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 duration-200 ease-in-out"
            onClick={() => handleChoiceClick(key)}
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionRandomizer;
