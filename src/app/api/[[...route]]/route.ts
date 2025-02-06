import { Redis } from "@upstash/redis";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";

type EnvConfig = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

const app = new Hono<{ Bindings: EnvConfig }>().basePath("/api");

app.get("/ping", (c) => {
  return c.text("pong");
});

app.post("/result", async (c) => {
  try {
    const { score, userName } = await c.req.json();

    if (!score || !userName) {
      return c.json({ message: "invalid request" }, 400);
    }

    const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } =
      env<EnvConfig>(c);

    const redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });

    const result = {
      score: score,
      member: userName,
    };
    await redis.zadd("typing-score-rank", result);

    return c.json({ message: "Success" }, 200);
  } catch (e) {
    return c.json({ error: `Error: ${e}` }, 500);
  }
});

app.get("/result", async (c) => {
  try {
    const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } =
      env<EnvConfig>(c);

    const redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });

    const result = await redis.zrange("typing-score-rank", 0, 9, {
      rev: true,
      withScores: true,
    });

    const scores = [];
    for (let i = 0; i < result.length; i += 2) {
      scores.push({
        userName: result[i],
        score: result[i + 1],
      });
    }

    return c.json({ result: scores }, 200);
  } catch (e) {
    return c.json({ error: `Error: ${e}` }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
