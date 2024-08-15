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
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [allQuestionsReached, setAllQuestionsReached] = useState(false);

  useEffect(() => {
    fetch("/data/choiceQuestions.json")
      .then((response) => response.json())
      .then((data) => {
        setRemainingQuestions(data.questions);
        setRandomQuestion(data.questions);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const setRandomQuestion = (questions: Question[]) => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestionData(questions[randomIndex]);
  };

  const handleChoiceClick = (choiceKey: string) => {
    if (questionData) {
      const correct = questionData.correctAnswer === choiceKey;
      setIsCorrect(correct);

      if (correct) {
        const newRemainingQuestions = remainingQuestions.filter(
          (q) => q.id !== questionData.id
        );

        if (newRemainingQuestions.length > 0) {
          setTimeout(() => {
            setRemainingQuestions(newRemainingQuestions);
            setRandomQuestion(newRemainingQuestions);
            setIsCorrect(null);
          }, 1000); // change the correct message delay until next question here
        } else {
          setAllQuestionsReached(true);
        }
      }
    }
  };

  if (allQuestionsReached) {
    return <div className="text-center text-2xl">every questions reached</div>;
  }

  if (!questionData) {
    return <div className="text-center">loading</div>;
  }

  return (
    <div className="relative p-4 border rounded-md mx-auto">
      {/* overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center dark:text-white text-black text-4xl ${
          isCorrect === null ? "opacity-0 transition-none duration-0" : "opacity-100 transition-opacity duration-300"
        } ${isCorrect !== null && "backdrop-blur"}`}
      >
        {isCorrect ? "correct" : "incorrect"}
      </div>
      {/* card itself */}
      <div
        className={`relative z-10 ${
          isCorrect !== null && "blur-sm pointer-events-none"
        }`}
      >
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
    </div>
  );
};

export default QuestionRandomizer;
