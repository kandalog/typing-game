"use client";

import { useState, useEffect, useRef } from "react";

const question = [
  { question: "React", image: "./monster1.jpg" },
  { question: "TypeScript", image: "./monster2.jpg" },
  { question: "JISOU", image: "./monster3.jpg" },
  { question: "GitHub", image: "./monster4.jpg" },
  { question: "Next.js", image: "./monster5.jpg" },
];

type Score = {
  score: number;
  userName: string;
};

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userName, setUserName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState<Score[]>([]);
  const bgmRef = useRef<HTMLAudioElement>(null);
  const shotSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    bgmRef.current = new Audio("/bgm.md3");
    bgmRef.current.loop = true;
    shotSoundRef.current = new Audio("shot.mp3");
  }, []);

  useEffect(() => {
    if (isStarted && bgmRef.current) {
      bgmRef.current.play();
    }
    if (isCompleted && bgmRef.current) {
      bgmRef.current.pause();
    }
  }, [isStarted, isCompleted]);

  const addResult = async (userName: string, startTime: number) => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const timeInSeconds = totalTime / 1000;
    const baseScore = 1000;
    const timeDeduction = timeInSeconds * 100;
    const score = baseScore - timeDeduction;

    await fetch("/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: score,
        userName: userName,
      }),
    });

    return { totalTime, score };
  };

  const fetchScores = async () => {
    const response = await fetch("/api/result");
    const data = await response.json();
    return data.result;
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentQuestion = question[currentQuestionIndex];
      if (
        e.key.toLowerCase() ===
        currentQuestion.question[currentPosition].toLowerCase()
      ) {
        setCurrentPosition((prev) => prev + 1);
      }
      if (currentPosition === currentQuestion.question.length - 1) {
        if (currentQuestionIndex === question.length - 1) {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
          const { totalTime, score } = await addResult(userName, startTime);
          setTotalTime(totalTime);
          setScore(score);
          setIsCompleted(true);

          const scores = await fetchScores();
          console.log(scores);
          setScores(scores);
        } else {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
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
            <p>Score: {score}</p>
          </div>
          <div className="mt-8">
            <h3>Ranking</h3>
            {scores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p>Loading scores...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scores &&
                  scores.map((score, index) => (
                    <div key={index} className="border-b border-gray-700 pb-2">
                      <span>
                        {index + 1}. {score.userName + " "}
                      </span>
                      <span className="text-red-500">
                        {Math.round(score.score * 100) / 100}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
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
