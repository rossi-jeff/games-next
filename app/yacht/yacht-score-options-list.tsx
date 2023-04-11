"use client";

import { YachtScoreOption } from "../../types/yacht-score-option.type";
import React, { useState } from "react";

export default function YachtScoreOptionsList({
  options,
  scoreOption,
}: {
  options: YachtScoreOption[];
  scoreOption: Function;
}) {
  const [selected, setSelected] = useState<number>(-1);

  const radioChanged = (ev: any) => {
    let { value } = ev.target;
    setSelected(parseInt(value));
  };

  const scoreClicked = () => {
    const option = options[selected];
    scoreOption({ option });
  };

  return (
    <div className="mx-2 border border-black rounded p-2 mb-2">
      {options.map((option, index) => (
        <div key={index} className="flex flex-wrap mx-2">
          <div className="mr-2">
            <input
              type="radio"
              name="score-option"
              value={index}
              checked={selected == index}
              onChange={radioChanged}
            />
          </div>
          <div className="flex-grow">{option.Category}</div>
          <div>{option.Score}</div>
        </div>
      ))}
      <div>
        <button onClick={scoreClicked}>Score Option</button>
      </div>
    </div>
  );
}
