"use client";

import { useEffect, useState } from "react";
import { ShipDirections, ShipTypeLength } from "../../enum/ship-type.enum";
import { SeaBattleMaxAxis } from "../../lib/sea-battle-max-axis";
import { PointType } from "../../types/point-type.type";

type PlacementType = {
  ShipType: string;
  Horizontal: string;
  Vertical: number;
  Direction: string;
};

type PlaceShipType = {
  Type: string;
  Size: number;
  Points: PointType[];
};

export default function SeaBattleShipPlacement({
  axis,
  shipsToPlace,
  placeShip,
}: {
  axis: number;
  shipsToPlace: string[];
  placeShip: Function;
}) {
  const horizontal = SeaBattleMaxAxis.H.slice(0, axis);
  const vertical = SeaBattleMaxAxis.V.slice(0, axis);
  const directions: string[] = ShipDirections;

  const [highlighted, setHighlighted] = useState<PointType[]>([]);
  const [occupied, setOccupied] = useState<PointType[]>([]);
  const [placement, setPlacement] = useState<PlacementType>({
    ShipType: shipsToPlace[0],
    Horizontal: horizontal[0],
    Vertical: vertical[0],
    Direction: directions[0],
  });
  const [errors, setErrors] = useState<string[]>([]);

  const shipTypeChanged = (ev: any) => {
    const ShipType = shipsToPlace[ev.target.selectedIndex];
    setPlacement({
      ...placement,
      ShipType,
    });
    highlightShip();
  };

  const horizontalChanged = (ev: any) => {
    const Horizontal = horizontal[ev.target.selectedIndex];
    setPlacement({
      ...placement,
      Horizontal,
    });
    highlightShip();
  };

  const verticalChanged = (ev: any) => {
    const Vertical = vertical[ev.target.selectedIndex];
    setPlacement({
      ...placement,
      Vertical,
    });
    highlightShip();
  };

  const directionChanged = (ev: any) => {
    const Direction = directions[ev.target.selectedIndex];
    setPlacement({
      ...placement,
      Direction,
    });
    highlightShip();
  };

  const placeShipClicked = () => {
    let el;
    const o: PointType[] = [...occupied];
    const ship: PlaceShipType = {
      Type: placement.ShipType,
      Size: ShipTypeLength[placement.ShipType],
      Points: [],
    };
    for (const point of highlighted) {
      el = document.getElementById(`P-${point.Vertical}-${point.Horizontal}`);
      if (el) {
        el.classList.remove("highlighted");
        el.classList.add("occupied");
      }
      o.push(point);
      ship.Points.push(point);
    }
    setOccupied(o);
    setHighlighted([]);
    placeShip({ ship });
    setPlacement({
      ShipType: shipsToPlace[0],
      Horizontal: horizontal[0],
      Vertical: vertical[0],
      Direction: directions[0],
    });
    el = document.getElementById("ship-type") as HTMLSelectElement;
    if (el) el.selectedIndex = 0;
    el = document.getElementById("horizontal-start") as HTMLSelectElement;
    if (el) el.selectedIndex = 0;
    el = document.getElementById("vertical-start") as HTMLSelectElement;
    if (el) el.selectedIndex = 0;
    el = document.getElementById("ship-direction") as HTMLSelectElement;
    if (el) el.selectedIndex = 0;
  };

  const highlightShip = () => {
    // state is usually behind, useEffect causes max update depth
    const e: string[] = [];
    let points: PointType[] = [];
    let el;
    let H, V, D, T;
    el = document.getElementById("ship-type") as HTMLSelectElement;
    if (el) T = shipsToPlace[el.selectedIndex];
    el = document.getElementById("horizontal-start") as HTMLSelectElement;
    if (el) H = horizontal[el.selectedIndex];
    el = document.getElementById("vertical-start") as HTMLSelectElement;
    if (el) V = vertical[el.selectedIndex];
    el = document.getElementById("ship-direction") as HTMLSelectElement;
    if (el) D = directions[el.selectedIndex];
    if (highlighted.length) {
      for (const point of highlighted) {
        el = document.getElementById(`P-${point.Vertical}-${point.Horizontal}`);
        if (el) el.classList.remove("highlighted");
      }
    }
    if (!H || !V || !T || !D) return;
    let idxH = horizontal.indexOf(H);
    let idxV = vertical.indexOf(V);
    const size = ShipTypeLength[T];
    while (e.length == 0 && points.length < size) {
      points = [];
      while (points.length < size) {
        if (idxH < 0 || idxH >= axis) {
          e.push("Ship crosses horizontal boundary");
          break;
        }
        if (idxV < 0 || idxV >= axis) {
          e.push("Ship crosses vertical boundary");
          break;
        }
        const point: PointType = {
          Horizontal: horizontal[idxH],
          Vertical: vertical[idxV],
        };
        if (
          occupied.find(
            (p) =>
              p.Horizontal == point.Horizontal && p.Vertical == point.Vertical
          )
        ) {
          e.push("Ship crosses already placed ship");
          break;
        }
        points.push(point);
        switch (D) {
          case "up":
            idxV--;
            break;
          case "down":
            idxV++;
            break;
          case "left":
            idxH--;
            break;
          case "right":
            idxH++;
            break;
        }
      }
    }
    setErrors(e);
    for (const point of points) {
      el = document.getElementById(`P-${point.Vertical}-${point.Horizontal}`);
      if (el) el.classList.add("highlighted");
    }
    setHighlighted(points);
  };

  return (
    <div className="rounded-box flex flex-wrap">
      <div className="sea-battle-placement-grid">
        <div className="grid-row">
          <div className="grid-header-cell"></div>
          {horizontal.map((H) => (
            <div key={"pg-th-" + H} className="grid-header-cell">
              {H}
            </div>
          ))}
        </div>
        {vertical.map((V) => (
          <div key={"pg-r-" + V} className="grid-row">
            <div className="grid-header-cell">{V}</div>
            {horizontal.map((H) => (
              <div
                key={"pg-c-" + V + "-" + H}
                className="grid-cell"
                id={"P-" + V + "-" + H}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="p-2">
        <div className="score-row py-1">
          <div>
            <label htmlFor="ship-type" className="inline-block font-bold w-24">
              Ship Type
            </label>
            <select
              name="ship-type"
              defaultValue={shipsToPlace[0]}
              onChange={(ev) => shipTypeChanged(ev)}
              id="ship-type"
            >
              {shipsToPlace.map((shipType, index) => (
                <option key={index} value={shipType}>
                  {shipType}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="score-row py-1">
          <div>
            <label
              htmlFor="horizontal-start"
              className="inline-block font-bold w-24"
            >
              Horizontal
            </label>
            <select
              name="horizontal-start"
              defaultValue={horizontal[0]}
              onChange={(ev) => horizontalChanged(ev)}
              id="horizontal-start"
            >
              {horizontal.map((H, i) => (
                <option key={i} value={H}>
                  {H}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="score-row py-1">
          <div>
            <label
              htmlFor="vertical-start"
              className="inline-block font-bold w-24"
            >
              Vertical
            </label>
            <select
              name="vertical-start"
              defaultValue={vertical[0]}
              onChange={(ev) => verticalChanged(ev)}
              id="vertical-start"
            >
              {vertical.map((V, i) => (
                <option key={i} value={V}>
                  {V}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="score-row py-1">
          <div>
            <label
              htmlFor="ship-direction"
              className="inline-block font-bold w-24"
            >
              Direction
            </label>
            <select
              name="ship-direction"
              defaultValue={directions[0]}
              onChange={(ev) => directionChanged(ev)}
              id="ship-direction"
            >
              {directions.map((D, i) => (
                <option key={i} value={D}>
                  {D}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="score-row py-1">
          <div className="ml-24">
            {errors.length > 0 ? (
              <ul>
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            ) : (
              <button onClick={placeShipClicked}>Place Ship</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
