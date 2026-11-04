import type { PokemonStat } from '@/services/pokemon';

export type StatWinner = 'first' | 'second' | 'tie';

export type ComparedStat = {
  name: string;
  firstValue: number;
  secondValue: number;
  winner: StatWinner;
};

export type CompareStatsResult = {
  stats: ComparedStat[];
  firstWins: number;
  secondWins: number;
  winner: StatWinner;
};

export function compareStats(firstStats: PokemonStat[], secondStats: PokemonStat[]): CompareStatsResult {
  const secondValues = new Map(secondStats.map((stat) => [stat.name, stat.value]));
  const stats = firstStats.flatMap((firstStat) => {
    const secondValue = secondValues.get(firstStat.name);

    if (secondValue === undefined) {
      return [];
    }

    return [{
      name: firstStat.name,
      firstValue: firstStat.value,
      secondValue,
      winner:
        firstStat.value > secondValue
          ? 'first'
          : firstStat.value < secondValue
            ? 'second'
            : 'tie',
    } satisfies ComparedStat];
  });
  const firstWins = stats.filter((stat) => stat.winner === 'first').length;
  const secondWins = stats.filter((stat) => stat.winner === 'second').length;

  return {
    stats,
    firstWins,
    secondWins,
    winner: firstWins > secondWins ? 'first' : firstWins < secondWins ? 'second' : 'tie',
  };
}