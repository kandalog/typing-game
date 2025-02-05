"use client";

import { useState, useEffect } from "react";

const question = [
  { question: "React", image: "./monster1.jpg" },
  { question: "TypeScript", image: "./monster2.jpg" },
  { question: "JISOU", image: "./monster3.jpg" },
  { question: "GitHub", image: "./monster4.jpg" },
  { question: "Next.js", image: "./monster5.jpg" },
];

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentQuestion = question[currentQuestionIndex];
      if (
        e.key.toLowerCase() ===
        currentQuestion.question[currentPosition].toLowerCase()
      ) {
        setCurrentPosition((prev) => prev + 1);
      }
      if (currentPosition === currentQuestion.question.length - 1) {
        if (currentQuestionIndex === question.length - 1) {
          setIsCompleted(true);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setCurrentPosition(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentQuestionIndex, currentPosition, isCompleted]);

  if (isCompleted) {
    return <div>ゲーム終了</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="text-center w-full h-screen gb-cover gb-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${question[currentQuestionIndex].image})`,
          backgroundColor: "rgba(0,0,0,0.5",
          backgroundBlendMode: "overlay",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div>
          {question[currentQuestionIndex].question
            .split("")
            .map((char, index) => (
              <span
                key={index}
                style={{ color: index < currentPosition ? "#ff0000" : "#fff" }}
              >
                {char}
              </span>
            ))}
        </div>
      </div>
    </main>
  );
}
