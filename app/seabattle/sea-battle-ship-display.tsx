import { SeaBattleShip } from "@/types/sea-batte-ship.type";

export default function SeaBattleShipDisplay({
  ship,
}: {
  ship: SeaBattleShip;
}) {
  return (
    <div className="sea-battle-ship-display">
      <div className="ship-icon">
        {ship.points &&
          ship.points.map((point) => (
            <div key={point.id} className="grid-cell occupied">
              <span></span>
            </div>
          ))}
      </div>
      <div className="font-bold text-center">{ship.Type}</div>
    </div>
  );
}
