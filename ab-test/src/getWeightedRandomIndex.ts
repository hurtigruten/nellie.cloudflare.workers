export const getWeightedRandomIndex = (weights: number[]) => {
  const weightSum = weights.reduce((p, a) => p + a, 0);
  if (weightSum - 1 > 1e-10) {
    throw new Error("Weights do not sum to 1");
  }
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; ++i) {
    sum += weights[i];
    if (r < sum) {
      return i;
    }
  }
  return 0;
};
