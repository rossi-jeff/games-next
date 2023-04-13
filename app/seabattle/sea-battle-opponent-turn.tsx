"use client";

import { SeaBattleMaxAxis } from "@/lib/sea-battle-max-axis";
import { SeaBattleShip } from "@/types/sea-batte-ship.type";
import { SeaBattleTurn } from "@/types/sea-battle-turn.type";

export default function SeaBattleOpponentTurn({
  axis,
  ships,
  turns,
  hasFired,
  fire,
  toggle,
}: {
  axis: number;
  ships: SeaBattleShip[];
  turns: SeaBattleTurn[];
  hasFired: boolean;
  fire: Function;
  toggle: Function;
}) {
  const horizontal = SeaBattleMaxAxis.H.slice(0, axis);
  const vertical = SeaBattleMaxAxis.V.slice(0, axis);

  const fireClicked = () => {
    fire();
  };

  const toggleClicked = () => {
    toggle();
  };
  return (
    <div className="rounded-box">
      {hasFired ? (
        <button onClick={toggleClicked}>Player Turn</button>
      ) : (
        <button onClick={fireClicked}>Fire</button>
      )}
    </div>
  );
}
