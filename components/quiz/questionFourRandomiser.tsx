"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useScore } from "@/components/quiz/scoreContext";

interface ChoiceQuestion {
  type: "choice";
  id: number;
  question: string;
  choices: {
    [key: string]: string;
  };
  correctAnswer: string;
}

interface LatexQuestion {
  type: "latex";
  id: number;
  question: string;
  correctAnswer: string[];
}

type Question = ChoiceQuestion | LatexQuestion;

interface AnsweredChoiceQuestion extends ChoiceQuestion {
  selectedAnswer: string;
}

interface AnsweredLatexQuestion extends LatexQuestion {
  selectedAnswer: string;
}

const isChoiceQuestion = (question: Question): question is ChoiceQuestion => {
  return question.type === "choice";
};

const ChoiceQuestionCard: React.FC<{
  question: ChoiceQuestion | AnsweredChoiceQuestion;
  onAnswer?: (choiceKey: string) => void;
  isAnswered: boolean;
}> = ({ question, onAnswer, isAnswered }) => {
  const isCorrect =
    isAnswered &&
    (question as AnsweredChoiceQuestion).selectedAnswer ===
      question.correctAnswer;

  return (
    <div className="relative p-4 border rounded-md mx-auto mb-4">
      <p className="text-lg mb-4">{question.question}</p>
      <ul className="space-y-2">
        {Object.entries(question.choices).map(([key, value]) => (
          <li
            key={key}
            className={`p-2 border rounded-md cursor-pointer duration-200 ease-in-out ${
              isAnswered
                ? key === (question as AnsweredChoiceQuestion).selectedAnswer
                  ? isCorrect
                    ? "bg-green-500 dark:bg-opacity-30 bg-opacity-15 border-green-500 dark:text-white text-black"
                    : "bg-red-500 bg-opacity-30 border-red-500 dark:text-white text-black"
                  : key === question.correctAnswer
                  ? "bg-green-500 dark:bg-opacity-30 bg-opacity-15 border-green-500 dark:text-white text-black"
                  : "bg-neutral-100 dark:bg-neutral-800"
                : "bg-neutral-100 dark:bg-neutral-800"
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

const LatexQuestionCard: React.FC<{
  question: LatexQuestion | AnsweredLatexQuestion;
  onAnswer?: (inputValue: string) => void;
  isAnswered: boolean;
}> = ({ question, onAnswer, isAnswered }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [question]);

  const isCorrect =
    isAnswered &&
    (question as AnsweredLatexQuestion).correctAnswer.includes(
      (question as AnsweredLatexQuestion).selectedAnswer
    );

  return (
    <div className="relative p-4 border rounded-md mx-auto mb-4">
      <div className="pb-3">
        <p>{question.question}</p>
      </div>
      <Input
        type="text"
        placeholder="answer here, click submit when done"
        value={
          isAnswered
            ? (question as AnsweredLatexQuestion).selectedAnswer
            : inputValue
        }
        onChange={(e) => setInputValue(e.target.value.toLowerCase())}
        className={`mb-2 ${
          isAnswered
            ? isCorrect
              ? "border-green-500 bg-green-500 dark:bg-opacity-30 bg-opacity-15"
              : "border-red-500 bg-red-500 dark:bg-opacity-30 bg-opacity-15"
            : ""
        }`}
        readOnly={isAnswered}
      />
      {!isAnswered && (
        <Button
          className="transition-all duration-200 ease-in-out"
          onClick={() => onAnswer && onAnswer(inputValue)}
        >
          Submit
        </Button>
      )}
    </div>
  );
};

const QuestionRandomizer: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    (AnsweredChoiceQuestion | AnsweredLatexQuestion)[]
  >([]);
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [allQuestionsReached, setAllQuestionsReached] = useState(false);

  const { setCorrectChoices, setWrongChoices } = useScore(); // context usage here

  const questionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/choiceQuestions.json").then((response) => response.json()),
      fetch("/data/latexFill.json").then((response) => response.json()),
    ])
      .then(([choiceData, latexData]) => {
        const allQuestions = [
          ...choiceData.questions.map((q: ChoiceQuestion, index: number) => ({
            ...q,
            id: index + 1,
            type: "choice",
          })),
          ...latexData.questions.map((q: LatexQuestion, index: number) => ({
            ...q,
            id: choiceData.questions.length + index + 1,
            type: "latex",
          })),
        ];

        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

        setRemainingQuestions(shuffledQuestions);
        setRandomQuestion(shuffledQuestions);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  useEffect(() => {
    if (questionsContainerRef.current) {
      questionsContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [answeredQuestions]);

  const setRandomQuestion = (questions: Question[]) => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  };

  const handleAnswer = (answer: string) => {
    if (currentQuestion) {
      let isCorrect = false;

      if (isChoiceQuestion(currentQuestion)) {
        const answeredQuestion: AnsweredChoiceQuestion = {
          ...currentQuestion,
          selectedAnswer: answer,
        };
        setAnsweredQuestions([...answeredQuestions, answeredQuestion]);
        isCorrect =
          answeredQuestion.selectedAnswer === answeredQuestion.correctAnswer;
      } else {
        const answeredQuestion: AnsweredLatexQuestion = {
          ...currentQuestion,
          selectedAnswer: answer,
        };
        setAnsweredQuestions([...answeredQuestions, answeredQuestion]);
        isCorrect = answeredQuestion.correctAnswer.includes(
          answeredQuestion.selectedAnswer
        );
      }

      if (isCorrect) {
        setCorrectChoices((prev: number) => prev + 1);
      } else {
        setWrongChoices((prev: number) => prev + 1);
      }

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

  const calculateResults = () => {
    let correctChoices = 0;
    let wrongChoices = 0;

    answeredQuestions.forEach((question) => {
      const isCorrect = isChoiceQuestion(question)
        ? question.selectedAnswer === question.correctAnswer
        : question.correctAnswer.includes(question.selectedAnswer);

      if (isCorrect) {
        correctChoices++;
      } else {
        wrongChoices++;
      }
    });

    return { correctChoices, wrongChoices };
  };

  if (allQuestionsReached) {
    return (
      <div ref={questionsContainerRef} className="pb-5">
        {answeredQuestions.map((q) =>
          isChoiceQuestion(q) ? (
            <ChoiceQuestionCard key={q.id} question={q} isAnswered={true} />
          ) : (
            <LatexQuestionCard key={q.id} question={q} isAnswered={true} />
          )
        )}
        <div className="text-center text-2xl">
          every question has been answered
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center text-2xl">loading</div>;
  }

  return (
    <div ref={questionsContainerRef} className="pb-3">
      {answeredQuestions.map((q) =>
        isChoiceQuestion(q) ? (
          <ChoiceQuestionCard key={q.id} question={q} isAnswered={true} />
        ) : (
          <LatexQuestionCard key={q.id} question={q} isAnswered={true} />
        )
      )}
      {currentQuestion && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isChoiceQuestion(currentQuestion) ? (
            <ChoiceQuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              isAnswered={false}
            />
          ) : (
            <LatexQuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              isAnswered={false}
            />
          )}
        </motion.div>
      )}
      {allQuestionsReached && (
        <div className="text-center text-2xl mb-2">
          every question has been answered
        </div>
      )}
    </div>
  );
};

export default QuestionRandomizer;
