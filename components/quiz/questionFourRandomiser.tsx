"use client";

import React, { useState, useEffect, useRef } from "react";

interface Question {
  id: number;
  question: string;
  choices: {
    [key: string]: string;
  };
  correctAnswer: string;
}

interface AnsweredQuestion extends Question {
  selectedAnswer: string;
}

const QuestionCard: React.FC<{
  question: Question | AnsweredQuestion;
  onAnswer?: (choiceKey: string) => void;
  isAnswered: boolean;
}> = ({ question, onAnswer, isAnswered }) => {
  const isCorrect =
    isAnswered &&
    (question as AnsweredQuestion).selectedAnswer === question.correctAnswer;

  return (
    <div className="relative p-4 border rounded-md mx-auto mb-4">
      <p className="text-lg mb-4">{question.question}</p>
      <ul className="space-y-2">
        {Object.entries(question.choices).map(([key, value]) => (
          <li
            key={key}
            className={`p-2 border rounded-md cursor-pointer duration-200 ease-in-out ${
              isAnswered
                ? key === (question as AnsweredQuestion).selectedAnswer
                  ? isCorrect
                    ? "bg-green-500 dark:bg-opacity-30 bg-opacity-15 border-green-500 dark:text-white text-black"
                    : "bg-red-500 bg-opacity-30 border-red-500 dark:text-white text-black"
                  : key === question.correctAnswer
                  ? "bg-green-500 dark:bg-opacity-30 bg-opacity-15 border-green-500 dark:text-white text-black"
                  : "bg-neutral-100 dark:bg-neutral-800"
                : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            }`}
            onClick={() => !isAnswered && onAnswer && onAnswer(key)}
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

const QuestionRandomizer: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    AnsweredQuestion[]
  >([]);
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [allQuestionsReached, setAllQuestionsReached] = useState(false);

  const questionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/choiceQuestions.json")
      .then((response) => response.json())
      .then((data) => {
        setRemainingQuestions(data.questions);
        setRandomQuestion(data.questions);
      })
      .catch((error) => console.error("error fetching questions:", error));
  }, []);

  useEffect(() => {
    if (questionsContainerRef.current) {
      questionsContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end", // aligns the bottom of the element to the bottom of the scrollable ancestor
      });
    }
  }, [answeredQuestions]);

  const setRandomQuestion = (questions: Question[]) => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  };

  const handleAnswer = (choiceKey: string) => {
    if (currentQuestion) {
      const answeredQuestion: AnsweredQuestion = {
        ...currentQuestion,
        selectedAnswer: choiceKey,
      };
      setAnsweredQuestions([...answeredQuestions, answeredQuestion]);

      const newRemainingQuestions = remainingQuestions.filter(
        (q) => q.id !== currentQuestion.id
      );

      if (newRemainingQuestions.length > 0) {
        setRemainingQuestions(newRemainingQuestions);
        setRandomQuestion(newRemainingQuestions);
      } else {
        setAllQuestionsReached(true);
        setCurrentQuestion(null);
      }
    }
  };

  if (allQuestionsReached) {
    return (
      <div ref={questionsContainerRef} className="pb-5">
        {answeredQuestions.map((q) => (
          <QuestionCard key={q.id} question={q} isAnswered={true} />
        ))}
        <div className="text-center text-2xl mb-4">All questions answered!</div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center text-2xl">Loading questions...</div>;
  }

  return (
    <div ref={questionsContainerRef}>
      {answeredQuestions.map((q) => (
        <QuestionCard key={q.id} question={q} isAnswered={true} />
      ))}
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        isAnswered={false}
      />
    </div>
  );
};

export default QuestionRandomizer;
