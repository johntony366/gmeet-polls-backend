import { Entity, Schema } from "redis-om";
import redis from "../config/redisConfig";

class Poll extends Entity {}

const pollSchema = new Schema(
  Poll,
  {
    title: { type: "string" },
    options: { type: "string[]" },
  },
  { dataStructure: "JSON" },
);

async function vote(pollId, option) {
  const hashKey = `poll:${pollId}:votes`;
  redis.hIncrBy(hashKey, option, 1);
}

async function getResults(pollId) {
  const hashKey = `poll:${pollId}:votes`;
  const results = await redis.hGetAll(hashKey);
  return results;
}

export { Poll, pollSchema, vote, getResults };
