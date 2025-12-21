export const getWinRate = (won: number, played: number) => {
  return ((won / played) * 100).toFixed(1);
};
