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
  const [userName, setUserName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [score, setScore] = useState(0);

  const addResult = (userName: string, startTime: number) => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const timeInSeconds = totalTime / 1000;
    const baseScore = 1000;
    const timeDeduction = timeInSeconds * 100;
    const score = baseScore - timeDeduction;

    return { totalTime, score };
  };

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
          const { totalTime } = addResult(userName, startTime);
          setTotalTime(totalTime);
          setScore(totalTime);
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

  const handleStart = () => {
    if (!userName) {
      alert("名前を入力してください");
      return;
    }

    setIsStarted(true);
    setStartTime(Date.now());
  };

  if (!isStarted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="text-center p-8">
          <input
            type="text"
            placeholder="Enter your name..."
            className="w-64 p-3 text-lg"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div
          className="px-8 py-3 text-xl bg-red-900 cursor-pointer"
          onClick={handleStart}
        >
          start game
        </div>
      </main>
    );
  }

  if (isCompleted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="text-center p-8">
          <h2>Result</h2>
          <div className="mb-8 space-y-2">
            <p>Player: {userName}</p>
            <p>
              Time
              <span>{(totalTime / 1000).toFixed(2)}</span>
              seconds
            </p>
          </div>
        </div>
        ゲーム終了
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="text-center w-full h-screen gb-cover gb-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${question[currentQuestionIndex].image})`,
          backgroundColor: "rgba(0,0,0,0.5)",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          objectFit: "cover",
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
