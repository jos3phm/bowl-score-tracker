export type Pin = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Frame = {
  firstShot: Pin[] | null;
  secondShot: Pin[] | null;
  thirdShot?: Pin[] | null; // For 10th frame
  score: number | null;
  isStrike: boolean;
  isSpare: boolean;
  isSplit?: boolean;
};

export type Game = {
  id: string;
  date: string;
  location: string;
  format: "Scratch" | "Handicap" | "9-Pin No Tap";
  frames: Frame[];
  totalScore: number;
};

export type GameMetadata = {
  location: string;
  format: "Scratch" | "Handicap" | "9-Pin No Tap";
};

export type GameType = 'practice' | 'league' | 'tournament';
export type LaneConfig = 'single' | 'cross';