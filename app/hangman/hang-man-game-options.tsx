"use client";

import { useState } from "react";

export default function HangManGameOptions({ newGame }: { newGame: Function }) {
  const lengths = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const [min, setMin] = useState<number>(6);
  const [max, setMax] = useState<number>(12);

  const minChanged = (ev: any) => {
    setMin(lengths[ev.target.selectedIndex]);
  };

  const maxChanged = (ev: any) => {
    setMax(lengths[ev.target.selectedIndex]);
  };

  const newGameClicked = () => {
    newGame({ MIn: min, Max: max });
  };

  return (
    <div className="rounded-box">
      <div className="flex flex-wrap justify-between">
        <div>
          <label htmlFor="min-select" className="font-bold mr-2">
            Minimum
          </label>
          <select
            name="min-select"
            defaultValue={min}
            onChange={(ev) => minChanged(ev)}
          >
            {lengths.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="max-select" className="font-bold mr-2">
            Maximum
          </label>
          <select
            name="max-select"
            defaultValue={max}
            onChange={(ev) => maxChanged(ev)}
          >
            {lengths.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={newGameClicked}>New Game</button>
        </div>
      </div>
    </div>
  );
}
