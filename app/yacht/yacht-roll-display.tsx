"use client";

import { useEffect, useState } from "react";

export default function YachtRollDisplay({
  roll,
  heading,
  label,
  rollDice,
  flag,
}: {
  roll: string;
  heading: string;
  label: string;
  rollDice: Function;
  flag: boolean;
}) {
  const [dice, setDice] = useState<number[]>([]);
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    let d: number[] = roll.split(",").map((die) => parseInt(die));
    setDice(d);
  }, []);

  const cbChanged = (ev: any) => {
    let { value } = ev.target;
    value = parseInt(value);
    let selected = checked;
    let idx = selected.indexOf(value);
    if (idx == -1) {
      selected.push(value);
    } else {
      selected.splice(idx, 1);
    }
    setChecked(selected);
  };

  const clickRoll = () => {
    let keep: number[] = [];
    for (const idx of checked) keep.push(dice[idx]);
    rollDice({ keep });
  };

  return (
    <div className="mx-2 border border-black rounded p-2 mb-2">
      <h1>{heading}</h1>
      <div className="flex flex-wrap">
        {dice.map((d, i) => (
          <div key={i} className="p-2">
            <div>{d}</div>
            <input
              type="checkbox"
              value={i}
              onChange={cbChanged}
              disabled={flag}
            />
          </div>
        ))}
      </div>
      {!flag && <button onClick={() => clickRoll()}>{label}</button>}
    </div>
  );
}
