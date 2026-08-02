export function calculateV5Outcome(normalDice, hungerDice, difficulty) {
  const allDice = [...normalDice, ...hungerDice];
  const baseSuccesses = allDice.filter((die) => die >= 6).length;
  const tens = allDice.filter((die) => die === 10).length;
  const criticalPairs = Math.floor(tens / 2);
  const successes = baseSuccesses + criticalPairs * 2;
  const passed = successes >= difficulty;
  const messyCritical =
    passed && criticalPairs > 0 && hungerDice.includes(10);
  const bestialFailure = !passed && hungerDice.includes(1);

  return {
    successes,
    margin: successes - difficulty,
    tone: messyCritical
      ? 'messy'
      : bestialFailure
        ? 'bestial'
        : passed
          ? 'success'
          : 'failure',
    title: messyCritical
      ? 'Crítico bagunçado'
      : bestialFailure
        ? 'Falha bestial'
        : passed
          ? criticalPairs > 0
            ? 'Sucesso crítico'
            : 'Sucesso'
          : 'Falha',
  };
}

