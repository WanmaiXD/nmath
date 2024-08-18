"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useScore } from "@/components/quiz/scoreContext";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      answer: "",
    },
  });

  useEffect(() => {
    setValue("answer", "");
  }, [question, setValue]);

  const onSubmit = (data: { answer: string }) => {
    if (onAnswer) {
      onAnswer(data.answer.toLowerCase());
    }
  };

  const isCorrect =
    isAnswered &&
    (question as AnsweredLatexQuestion).correctAnswer.includes(
      (question as AnsweredLatexQuestion).selectedAnswer
    );

  return (
    <Form {...useForm({ defaultValues: { answer: "" } })}>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="relative p-4 border rounded-md mx-auto mb-4"
      >
        <div className="pb-3">
          <p>{question.question}</p>
        </div>
        <FormField
          control={control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Input
                  placeholder="your answer here"
                  {...field}
                  value={
                    isAnswered
                      ? (question as AnsweredLatexQuestion).selectedAnswer
                      : field.value
                  }
                  className={`mb-2 ${
                    isAnswered
                      ? isCorrect
                        ? "border-green-500 bg-green-500 dark:bg-opacity-30 bg-opacity-15"
                        : "border-red-500 bg-red-500 dark:bg-opacity-30 bg-opacity-15"
                      : ""
                  }`}
                  readOnly={isAnswered}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isAnswered && (
          <Button
            type="submit"
            className="mt-5 transition-all duration-200 ease-in-out"
          >
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

const QuestionRandomizer: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    (AnsweredChoiceQuestion | AnsweredLatexQuestion)[]
  >([]);
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [allQuestionsReached, setAllQuestionsReached] = useState(false);

  const { setCorrectChoices, setWrongChoices } = useScore();
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const [choiceData, latexData] = await Promise.all([
        fetch("/data/choiceQuestions.json").then((response) => response.json()),
        fetch("/data/latexFill.json").then((response) => response.json()),
      ]);

      const shuffledChoiceData = choiceData.questions.map((q: ChoiceQuestion, index: number) => ({
        ...q,
        id: index + 1,
        type: "choice",
        choices: Object.fromEntries(
          Object.entries(q.choices).sort(() => Math.random() - 0.5)
        ),
      }));

      const allQuestions = [
        ...shuffledChoiceData,
        ...latexData.questions.map((q: LatexQuestion, index: number) => ({
          ...q,
          id: choiceData.questions.length + index + 1,
          type: "latex",
        })),
      ];

      setRemainingQuestions(allQuestions.sort(() => Math.random() - 0.5));
      setRandomQuestion(allQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }, []);

  useEffect(() => {
    fetchQuestions().then((r) => r);
  }, [fetchQuestions]);

  useEffect(() => {
    questionsContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [answeredQuestions]);

  const setRandomQuestion = useCallback((questions: Question[]) => {
    setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
  }, []);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!currentQuestion) return;

      const isCorrect = isChoiceQuestion(currentQuestion)
        ? currentQuestion.correctAnswer === answer
        : currentQuestion.correctAnswer.includes(answer);

      const answeredQuestion = {
        ...currentQuestion,
        selectedAnswer: answer,
      } as AnsweredChoiceQuestion | AnsweredLatexQuestion;

      setAnsweredQuestions((prev) => [...prev, answeredQuestion]);
      isCorrect
        ? setCorrectChoices((prev) => prev + 1)
        : setWrongChoices((prev) => prev + 1);

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
    },
    [
      currentQuestion,
      remainingQuestions,
      setCorrectChoices,
      setWrongChoices,
      setRandomQuestion,
    ]
  );

  return (
    <div ref={questionsContainerRef} className="pb-3">
      {answeredQuestions.map((q) =>
        isChoiceQuestion(q) ? (
          <ChoiceQuestionCard key={q.id} question={q} isAnswered={true} />
        ) : (
          <LatexQuestionCard key={q.id} question={q} isAnswered={true} />
        )
      )}
      {currentQuestion && !allQuestionsReached && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
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
