import { levels } from "./levels";
import type { LevelInfo } from "./types";

export default function getLevelInfo(savings: number): LevelInfo | null {
  for (const levelInfo of levels) {
    if (savings < levelInfo.target) {
      return {
        level: levelInfo.level,
        title: levelInfo.title,
        target: levelInfo.target,
      };
    }
  }
  return null;
}

export function calculateTotalAmount(data: any[]): number {
    
  let totalAmount = 0;
  for (const item of data) {
    totalAmount += parseFloat(item._data.currentAmount);
  }
  return totalAmount;
}
