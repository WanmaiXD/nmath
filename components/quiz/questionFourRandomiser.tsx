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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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
    if (questionData && selectedAnswer === null) {
      setSelectedAnswer(choiceKey);
      const correct = questionData.correctAnswer === choiceKey;
      setIsCorrect(correct);

      setTimeout(() => {
        const newRemainingQuestions = remainingQuestions.filter(
          (q) => q.id !== questionData.id
        );

        if (newRemainingQuestions.length > 0) {
          setRemainingQuestions(newRemainingQuestions);
          setRandomQuestion(newRemainingQuestions);
        } else {
          setAllQuestionsReached(true);
        }

        setIsCorrect(null);
        setSelectedAnswer(null);
      }, 1000); // delay before showing the next question
    }
  };

  if (allQuestionsReached) {
    return <div className="text-center text-2xl">Every question reached</div>;
  }

  if (!questionData) {
    return <div className="text-center">Loading</div>;
  }

  return (
    <div className="relative p-4 border rounded-md mx-auto">
      {/* card itself */}
      <div
        className={`relative z-10`}
      >
        <p className="text-lg mb-4">{questionData.question}</p>
        <ul className="space-y-2">
          {Object.entries(questionData.choices).map(([key, value]) => (
            <li
              key={key}
              className={`p-2 border rounded-md cursor-pointer duration-200 ease-in-out ${
                selectedAnswer === key
                  ? isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : selectedAnswer === null
                  ? "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  : key === questionData.correctAnswer
                  ? "bg-green-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800"
              }`}
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
