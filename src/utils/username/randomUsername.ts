import { adjs } from "./adjs";
import { adverbs } from "./adverbs";
import { animals } from "./animals";
import { cliche } from "./cliche";
import { concreteNouns } from "./concreteNouns";
import { containerTypes } from "./containerTypes";
import { nouns } from "./nouns";

const nums = "0123456789".split("");

const weighted = <T>(arr: T[], weights: number[]): T => {
  if (arr.length !== weights.length) {
    throw new RangeError("Chance: Length of array and weights must match");
  }

  // scan weights array and sum valid entries
  let weightIndex = 0;
  let sum = 0;
  let val;
  for (weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
    val = weights[weightIndex];
    if (isNaN(val)) {
      throw new RangeError("Chance: All weights must be numbers");
    }

    if (val > 0) {
      sum += val;
    }
  }

  if (sum === 0) {
    throw new RangeError("Chance: No valid entries in array weights");
  }

  // select a value within range
  const selected = Math.random() * sum;

  // find array entry corresponding to selected value
  let total = 0;
  let lastGoodIdx = -1;
  let chosenIdx = 0;
  for (weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
    val = weights[weightIndex];
    total += val;
    if (val > 0) {
      if (selected <= total) {
        chosenIdx = weightIndex;
        break;
      }
      lastGoodIdx = weightIndex;
    }

    // handle any possible rounding error comparison to ensure something is picked
    if (weightIndex === weights.length - 1) {
      chosenIdx = lastGoodIdx;
    }
  }

  const chosen = arr[chosenIdx];

  return chosen;
};

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const choose = <T>(arr: T[]): T => arr[getRandomInt(0, arr.length)];

const many = <T>(arr: T[], min: number, max: number): T[] => {
  const result: T[] = [];
  for (let i = 0; i < max; i++) {
    if (i <= min) result.push(choose(arr));
    else if (weighted<boolean>([false, true], [0.5, 0.5]))
      result.push(choose(arr));
  }
  return result;
};

const titleCase = (str: string): string =>
  str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

const outputWeight = [
  0.5, 0.5, 1, 1, 0.4, 1, 0.25, 0.25, 0.1, 0.1, 0.025, 0.1, 0.005, 0.05, 0.1,
];
const output = [
  weighted<string>(["The", ""], [0.5, 1]) +
    titleCase(choose(adjs)) +
    titleCase(choose(nouns)), // 0.5
  weighted<string>(["The", ""], [0.5, 1]) + choose(adjs) + choose(nouns), // 0.5
  titleCase(choose(adjs)) + "_" + titleCase(choose(nouns)), // 1
  choose(adjs) + "_" + choose(nouns), // 1
  titleCase(choose(adverbs)) + titleCase(choose(adjs)), // 0.4
  choose(adjs) +
    choose(nouns) +
    weighted<string>(["_", ""], [0.2, 1]) +
    many(nums, 1, 4).join(""), // 1
  choose(adverbs) + "_" + choose(adjs) + "_" + choose(nouns), // 0.25
  choose(adverbs) + choose(adjs) + choose(nouns), // 0.25
  "PM_ME_YOUR_" + choose(nouns).toUpperCase(), // 0.1
  "PM_ME_YOUR_" +
    choose(adjs).toUpperCase() +
    "_" +
    choose(nouns).toUpperCase(), //0.1
  "throwaway" +
    weighted<string>(["_", ""], [0.2, 1]) +
    many(nums, 7, 12).join(""), // 0.025
  choose(cliche)
    .replaceAll(/[^a-z ]/g, "")
    .replaceAll(" ", "_"), // 0.1
  `2${choose(adjs)}4u`, // 0.005
  choose(containerTypes) + "_of_" + choose(concreteNouns), // 0.05
  titleCase(choose(adjs)) +
    titleCase(choose(animals).replaceAll(/[^a-z]/g, "")), // 0.1
];

const generateUsername = (): string => weighted<string>(output, outputWeight);

export { generateUsername };
