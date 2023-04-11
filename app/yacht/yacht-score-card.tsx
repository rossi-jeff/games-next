import { YachtTurn } from "../../types/yacht-turn.type";
import React from "react";

export default function YachtScoreCard({
  total,
  turns,
}: {
  total: number;
  turns: YachtTurn[];
}) {
  return (
    <div className="border border-black rounded p-2 mb-2">
      {turns.map((turn) => (
        <div key={turn.id} className="flex flex-wrap justify-between mx-2">
          <div>{turn.Category}</div>
          <div>{turn.RollOne}</div>
          <div>{turn.RollTwo}</div>
          <div>{turn.RollThree}</div>
          <div>{turn.Score}</div>
        </div>
      ))}
      <div className="flex flex-wrap mx-2">
        <div className="flex-grow text-right mr-2">Total</div>
        <div>{total}</div>
      </div>
    </div>
  );
}
