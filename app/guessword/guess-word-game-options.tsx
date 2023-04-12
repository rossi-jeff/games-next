import { useState } from "react";

export default function GuessWordGameOptions({
  newGame,
}: {
  newGame: Function;
}) {
  const [length, setLength] = useState<number>(5);
  const lengths: number[] = [4, 5, 6, 7, 8, 9, 10];

  const lengthChanged = (ev: any) => {
    setLength(lengths[ev.target.selectedIndex]);
  };

  const newGameClicked = () => {
    newGame({ Length: length });
  };

  return (
    <div className="rounded-box">
      <div className="flex flex-wrap">
        <label htmlFor="length-select" className="font-bold mr-2">
          Word Length
        </label>
        <select
          name="length-select"
          className="mr-2"
          onChange={(ev) => lengthChanged(ev)}
          defaultValue={length}
        >
          {lengths.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button onClick={newGameClicked}>New Game</button>
      </div>
    </div>
  );
}
