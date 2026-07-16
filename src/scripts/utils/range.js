export function getRangeProgress(input, value) {
  const min = Number(input.min);
  const max = Number(input.max);

  return (value - min) / (max - min);
}
