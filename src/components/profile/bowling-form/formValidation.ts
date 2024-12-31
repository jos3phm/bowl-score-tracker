import { BowlingBall } from "../BowlingBallList";

export const validateBowlingBall = (ball: Partial<BowlingBall>) => {
  const errors: { [key: string]: string } = {};

  if (!ball.brand) {
    errors.brand = "Brand is required";
  }

  if (!ball.name) {
    errors.name = "Ball name is required";
  }

  if (!ball.weight) {
    errors.weight = "Weight is required";
  } else {
    const weight = parseFloat(ball.weight.toString());
    if (weight < 8 || weight > 16) {
      errors.weight = "Weight must be between 8 and 16 pounds";
    }
  }

  if (ball.hook_rating !== undefined && ball.hook_rating !== null) {
    const hookRating = parseInt(ball.hook_rating.toString());
    if (hookRating < 0 || hookRating > 10) {
      errors.hook_rating = "Hook rating must be between 0 and 10";
    }
  }

  return errors;
};