import { useState } from "react";

export const useHistoricalFrame = () => {
  const [selectedHistoricalFrame, setSelectedHistoricalFrame] = useState<number | null>(null);

  return {
    selectedHistoricalFrame,
    setSelectedHistoricalFrame,
  };
};