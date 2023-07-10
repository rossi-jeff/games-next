"use client";

import React, { useState, useEffect } from "react";
import { Card } from "../../lib/card.class";
import { Deck } from "../../lib/deck.class";
import PlayingCard from "../../components/playing-card";
import useStorage, { SessionData, sessionKey } from "@/lib/session-storage";
import { apiUrl } from "@/lib/api-url";
import { buildRequestHeaders } from "@/lib/build-request-headers";
import { GameStatus } from "@/enum/game-status.enum";
import { PokerSquare } from "@/types/poker-square.type";
import PokerSquaresDirections from "@/components/poker-squares-directions";

type GridType = { [key: string]: { [key: number]: Card } };
type ScoreType = {
  row: { [key: string]: number };
  column: number[];
  total: number;
};

export default function PokerSquaresPage() {
  let deck: Deck | undefined;
  const rows = ["A", "B", "C", "D", "E"];
  const columns = [0, 1, 2, 3, 4];
  const [position, setPosition] = useState<{ Row: string; Column: number }>({
    Row: "A",
    Column: 0,
  });
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [grid, setGrid] = useState<GridType>({
    A: {},
    B: {},
    C: {},
    D: {},
    E: {},
  });
  const [scores, setScores] = useState<ScoreType>({
    row: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
    },
    column: [0, 0, 0, 0, 0],
    total: 0,
  });
  const { getItem } = useStorage();
  const session: SessionData = getItem(sessionKey, "session");
  const [pokerSquare, setPokerSquare] = useState<PokerSquare>({});

  const positionChanged = (ev: any) => {
    let { name, value } = ev.target;
    if (name == "Column") value = parseInt(value);
    setPosition({
      ...position,
      [name]: value,
    });
  };

  const placeCard = () => {
    let Waste: Card[] = [...waste];
    if (!Waste.length) return;
    const { Row, Column } = position;
    let Grid = { ...grid };
    if (Grid[Row][Column]) return;
    const card = Waste.pop();
    if (card) {
      card.draggable = false;
      Grid[Row][Column] = card;
      setWaste(Waste);
      setGrid(Grid);
      updateScores(Grid);
    }
  };

  const deal = () => {
    deck = new Deck();
    deck.shuffle();
    setWaste([]);
    setScores({
      row: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
      },
      column: [0, 0, 0, 0, 0],
      total: 0,
    });
    setGrid({
      A: {},
      B: {},
      C: {},
      D: {},
      E: {},
    });
    let cards: Card[] = [];
    while (cards.length < 25) {
      const card = deck.draw();
      if (card) {
        card.draggable = false;
        card.clickable = true;
        card.facedown = true;
        cards.push(card);
      }
    }
    setStock(cards);
    createGame();
  };

  const createGame = async () => {
    try {
      const result = await fetch(`${apiUrl}/api/klondike`, {
        method: "POST",
        headers: buildRequestHeaders(session),
      });
      if (result.ok) {
        const game = await result.json();
        setPokerSquare(game);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateGame = async (
    Score: number,
    Status: GameStatus = GameStatus.Won
  ) => {
    if (!pokerSquare.id) return;
    try {
      const result = await fetch(`${apiUrl}/api/klondike/${pokerSquare.id}`, {
        method: "PATCH",
        body: JSON.stringify({ Score, Status }),
        headers: buildRequestHeaders(),
      });
      if (result.ok) {
        const game = await result.json();
        setPokerSquare(game);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stockCardClicked = (event: any) => {
    const { id } = event;
    let cardId = parseInt(id.split("_")[2]);
    let Stock: Card[] = [...stock];
    let Waste: Card[] = [...waste];
    if (Waste.length || !Stock.length) return;
    const card = Stock.pop();
    if (card && card.id == cardId) {
      card.facedown = false;
      card.clickable = false;
      card.draggable = true;
      Waste.push(card);
      setStock(Stock);
      setWaste(Waste);
    }
  };

  const dragStart = (event: any) => {
    if (event.target) event.dataTransfer.setData("text", event.target.id);
    else if (event.detail)
      event.detail.dataTransfer.setData("text", event.detail.target.id);
  };

  const dragOver = (event: any) => {
    event.preventDefault();
  };

  const dragEnter = (event: any) => {
    let { target } = event;
    if (target) {
      while (target && !target.classList.contains("card-container")) {
        target = target.parentElement;
      }
      target.classList.add("over");
      setTimeout(() => target.classList.remove("over"), 500);
    }
  };

  const drop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    let { target } = event;
    let container: string = "";
    if (target) {
      while (target && !target.classList.contains("card-container")) {
        target = target.parentElement;
      }
      container = target.id;
    }
    let [row, column] = container.split("_");
    let Waste: Card[] = [...waste];
    if (!Waste.length) return;
    let Grid = { ...grid };
    if (Grid[row][parseInt(column)]) return;
    const card = Waste.pop();
    if (card) {
      card.draggable = false;
      Grid[row][parseInt(column)] = card;
      setWaste(Waste);
      setGrid(Grid);
      updateScores(Grid);
    }
  };

  const updateScores = (Grid: GridType) => {
    let Stock: Card[] = [...stock];
    let Scores: ScoreType = {
      row: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
      },
      column: [0, 0, 0, 0, 0],
      total: 0,
    };
    let hand: Card[] = [];
    let card: Card | undefined;
    // row scores
    for (const row of rows) {
      hand = [];
      for (const column of columns) {
        card = Grid[row][column];
        if (card) hand.push(card);
      }
      Scores.row[row] = hand.length == 5 ? scoreHand(hand) : 0;
      Scores.total += Scores.row[row];
    }
    // column scores
    for (const column of columns) {
      hand = [];
      for (const row of rows) {
        card = Grid[row][column];
        if (card) hand.push(card);
      }
      Scores.column[column] = hand.length == 5 ? scoreHand(hand) : 0;
      Scores.total += Scores.column[column];
    }
    setScores(Scores);
    if (!Stock.length) updateGame(Scores.total);
  };

  const scoreHand = (hand: Card[]) => {
    const results = checkHand(hand);
    if (results.isRoyal) return 100;
    if (results.isStraightFlush) return 75;
    if (results.isFourKind) return 50;
    if (results.isFullHouse) return 25;
    if (results.isFlush) return 20;
    if (results.isStraight) return 15;
    if (results.isThreeKind) return 10;
    if (results.isTwoPair) return 5;
    if (results.isPair) return 2;
    return 0;
  };

  const checkHand = (hand: Card[]) => {
    let deck = new Deck();
    let data: {
      faces: string[];
      suits: { [key: string]: number };
      counts: { [key: string]: number };
      order: number[];
    } = {
      faces: [],
      suits: {},
      counts: {},
      order: [],
    };
    for (const card of hand) {
      data.faces.push(card.face);
      if (!data.suits[card.suit]) data.suits[card.suit] = 0;
      if (!data.counts[card.face]) data.counts[card.face] = 0;
      data.suits[card.suit]++;
      data.counts[card.face]++;
      data.order.push(deck.faces.indexOf(card.face));
    }
    let results: { [key: string]: boolean } = {};
    results.isFlush = Object.values(data.suits).includes(5);
    results.isThreeKind = Object.values(data.counts).includes(3);
    results.isFourKind = Object.values(data.counts).includes(4);
    results.isPair = Object.values(data.counts).includes(2);
    results.isFullHouse = results.isThreeKind && results.isPair;
    results.isTwoPair = isTwoPair(Object.values(data.counts));
    results.isStraight = isStraight(data.order);
    results.isStraightFlush = results.isFlush && results.isStraight;
    results.isRoyal = results.isStraightFlush && data.faces.includes("king");
    return results;
  };

  const isStraight = (order: number[]) => {
    const sorted = order.sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i - 1] + 1 != sorted[i]) return false;
    }
    return true;
  };

  const isTwoPair = (values: number[]) => {
    const idx = values.indexOf(2);
    if (idx == -1) return false;
    return idx != values.lastIndexOf(2);
  };

  useEffect(() => {
    const { Row, Column } = position;
    const el = document.getElementById(`${Row}_${Column}`);
    if (el) {
      el.classList.add("over");
      setTimeout(() => {
        el.classList.remove("over");
      }, 500);
    }
  }, [position]);

  return (
    <div id="poker-squares-game" className="m-2">
      <h1>Poker Squares</h1>
      <div className="flex flex-wrap mb-4">
        {pokerSquare.Status != "Playing" && (
          <button onClick={deal}>Deal</button>
        )}
      </div>
      <div className="flex flex-wrap">
        <div className="mr-16">
          <div className="ps-column-header mb-2">
            <span className="inline-block mr-2">Total:</span>
            {scores.total}
          </div>
          <div id="stock" className="card-container mb-4">
            {stock.length > 0 &&
              stock.map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  level={0}
                  index={index}
                  from="stock"
                  dragStart={() => {}}
                  click={stockCardClicked}
                />
              ))}
          </div>
          <div id="waste" className="card-container mb-4">
            {waste.length > 0 &&
              waste.map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  level={0}
                  index={index}
                  from="waste"
                  click={() => {}}
                  dragStart={dragStart}
                />
              ))}
          </div>
          <div>
            <div className="mb-2">
              <label htmlFor="Row" className="w-16 inline-block">
                Row
              </label>
              <select
                name="Row"
                defaultValue={position.Row}
                onChange={positionChanged}
              >
                {rows.map((row, idx) => (
                  <option key={idx} value={row}>
                    {row}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="Column" className="w-16 inline-block">
                Column
              </label>
              <select
                name="Column"
                defaultValue={position.Column}
                onChange={positionChanged}
              >
                {columns.map((column, idx) => (
                  <option key={idx} value={column}>
                    {column + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button onClick={placeCard}>Place Card</button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap">
            <div className="h-4 w-4">&nbsp;</div>
            {columns.map((column) => (
              <div key={"h-" + column} className="ps-column-header mr-4 mb-2">
                {column + 1}
              </div>
            ))}
            <div className="h-4 w-4">&nbsp;</div>
          </div>
          {rows.map((row) => (
            <div key={row} className="flex flex-wrap">
              <div className="ps-row-label">{row}</div>
              {columns.map((column) => (
                <div
                  key={row + "_" + column}
                  id={row + "_" + column}
                  className="card-container mr-4 mb-4"
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  onDrop={drop}
                >
                  {typeof grid[row] == "object" &&
                    typeof grid[row][column] == "object" && (
                      <PlayingCard
                        card={grid[row][column]}
                        key={grid[row][column].id}
                        level={0}
                        from="grid"
                        index={0}
                        click={() => {}}
                        dragStart={() => {}}
                      />
                    )}
                </div>
              ))}
              <div className="ps-row-label">{scores.row[row]}</div>
            </div>
          ))}
          <div className="flex flex-wrap">
            <div className="h-4 w-4">&nbsp;</div>
            {columns.map((column) => (
              <div key={"s-" + column} className="ps-column-header mr-4">
                {scores.column[column]}
              </div>
            ))}
            <div className="h-4 w-4">&nbsp;</div>
          </div>
        </div>
      </div>
      {pokerSquare.Status != "Playing" && <PokerSquaresDirections />}
    </div>
  );
}
