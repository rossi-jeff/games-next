"use client";

import { useState } from "react";
import { Yacht } from "../../types/yacht.type";
import { YachtTurn } from "../../types/yacht-turn.type";
import YachtRollDisplay from "./yacht-roll-display";
import { YachtScoreOption } from "../../types/yacht-score-option.type";
import { apiUrl } from "../../lib/api-url";
import { buildRequestHeaders } from "../../lib/build-request-headers";
import YachtScoreOptionsList from "./yacht-score-options-list";

export default function YachtPlaying({
  yacht,
  reloadGame,
}: {
  yacht: Yacht;
  reloadGame: Function;
}) {
  const [turn, setTurn] = useState<YachtTurn>({});
  const [flagOne, setFlagOne] = useState<boolean>(false);
  const [flagTwo, setFlagTwo] = useState<boolean>(false);
  const [options, setOptions] = useState<YachtScoreOption[]>([]);

  const firstRoll = async () => {
    roll([]);
  };

  const secondRoll = async (ev: any) => {
    const { keep } = ev;
    setFlagOne(true);
    roll(keep);
  };

  const thirdRoll = async (ev: any) => {
    const { keep } = ev;
    setFlagTwo(true);
    roll(keep);
  };

  const roll = async (Keep: number[] = []) => {
    if (!yacht.id) return;
    try {
      const result = await fetch(`${apiUrl}/api/yacht/${yacht.id}/roll`, {
        method: "POST",
        body: JSON.stringify({ Keep }),
        headers: buildRequestHeaders(),
      });
      if (result.ok) {
        const { Turn, Options } = await result.json();
        setTurn(Turn);
        setOptions(Options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scoreOption = async (ev: any) => {
    console.log(ev);
    if (!yacht.id) return;
    const TurnId = turn.id || 0;
    const { Category } = ev.option;
    try {
      const result = await fetch(`${apiUrl}/api/yacht/${yacht.id}/score`, {
        method: "POST",
        body: JSON.stringify({ TurnId, Category }),
        headers: buildRequestHeaders(),
      });
      if (result.ok) {
        await result.json();
        setTurn({});
        setOptions([]);
        setFlagOne(false);
        setFlagTwo(false);
        reloadGame();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="border border-black rounded p-2 mb-2">
      {turn && turn.RollOne != undefined && turn.RollOne != "" ? (
        <YachtRollDisplay
          roll={turn.RollOne}
          heading="First Roll"
          label="Second Roll"
          rollDice={secondRoll}
          flag={flagOne}
        />
      ) : (
        <div>
          <button onClick={firstRoll}>First Roll</button>
        </div>
      )}
      {turn.RollTwo != undefined && turn.RollTwo != "" && (
        <YachtRollDisplay
          roll={turn.RollTwo}
          heading="Second Roll"
          label="Third Roll"
          rollDice={thirdRoll}
          flag={flagTwo}
        />
      )}
      {turn.RollThree != undefined && turn.RollThree != "" && (
        <YachtRollDisplay
          roll={turn.RollThree}
          heading="Third Roll"
          label=""
          rollDice={thirdRoll}
          flag={true}
        />
      )}
      {options && options.length > 0 && (
        <YachtScoreOptionsList options={options} scoreOption={scoreOption} />
      )}
    </div>
  );
}
