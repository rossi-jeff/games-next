"use client";

import PlayingCard from "@/components/playing-card";
import { Card } from "@/lib/card.class";
import { Deck } from "@/lib/deck.class";
import useStorage, { SessionData, sessionKey } from "@/lib/session-storage";
import { CardContainerType } from "@/types/card-container.type";
import { useRef, useState } from "react";

export default function SpiderPage() {
  let deck: Deck | undefined;
  let card: Card | undefined;
  const [aces, setAces] = useState<CardContainerType>({});
  const [tableau, setTableau] = useState<CardContainerType>({});
  const [stock, setStock] = useState<Card[]>([]);
  const [suits, setSuits] = useState(4);
  const moves = useRef(0);
  const { getItem } = useStorage();
  const session: SessionData = getItem(sessionKey, "session");
  const suitCounts: number[] = [4, 2, 1];

  // begin timer code
  const [elapsed, setElapsed] = useState(0);
  const initial = useRef(0);
  const paused = useRef(0);
  const interval = useRef<ReturnType<typeof setInterval> | undefined>();

  const clock = {
    start() {
      initial.current = Date.now();
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
      setElapsed(0);
      interval.current = setInterval(() => clock.tick(), 1000);
    },
    pause() {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
      paused.current = Date.now();
    },
    resume() {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
      if (paused.current) {
        const offset = Math.round((Date.now() - paused.current) / 1000);
        initial.current = initial.current + offset;
      }
      interval.current = setInterval(() => clock.tick(), 1000);
    },
    tick() {
      setElapsed(Math.round((Date.now() - initial.current) / 1000));
    },
  };
  // end timer code

  const suitChanged = (ev: any) => {
    const { selectedIndex } = ev.target;
    setSuits(suitCounts[selectedIndex]);
  };

  const deal = () => {
    deck = new Deck({ suits, decks: 2 });
    deck.preload();
    deck.shuffle();
    let Tableau: CardContainerType = {};
    let Aces: CardContainerType = {};
    let Stock: Card[] = [];
    for (let i = 0; i < 10; i++) Tableau[`tableau-${i}`] = [];
    for (let i = 0; i < 8; i++) Aces[`aces-${i}`] = [];
    let counter = 0;
    let index = 0;
    while (counter < 54) {
      card = deck.draw();
      if (card) {
        Tableau[`tableau-${index}`].push(card);
        counter++;
        index++;
        if (index >= 10) index = 0;
      }
    }
    while (deck.cards.length) {
      card = deck.draw();
      if (card) {
        card.clickable = true;
        Stock.push(card);
      }
    }
    setAces(Aces);
    setStock(Stock);
    adjustDraggable(Tableau);
  };

  const adjustDraggable = (Tableau: CardContainerType) => {
    deck = new Deck();
    let previous: Card | undefined, current: Card | undefined, length: number;
    for (const id in Tableau) {
      length = Tableau[id].length;
      if (length) {
        for (const card of Tableau[id]) card.draggable = false;
        previous = Tableau[id][length - 1];
        previous.facedown = false;
        previous.draggable = true;
        if (length > 1) {
          for (let i = length - 2; i >= 0; i--) {
            current = Tableau[id][i];
            if (current.facedown) break;
            if (current.suit != previous.suit) break;
            if (
              deck.faces.indexOf(current.face) !=
              deck.faces.indexOf(previous.face) + 1
            )
              break;
            current.draggable = true;
            previous = current;
          }
        }
      }
    }
    setTableau(Tableau);
  };

  const stockCardClicked = () => {
    let Stock: Card[] = [...stock];
    let Tableau: CardContainerType = { ...tableau };
    for (const id in Tableau) {
      card = Stock.pop();
      if (card) {
        card.facedown = false;
        card.clickable = false;
        card.draggable = true;
        Tableau[id].push(card);
      } else break;
    }
    setStock(Stock);
    adjustDraggable(Tableau);
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
    const data = event.dataTransfer.getData("text");
    let [from, level, id, index] = data.split("_");
    level = parseInt(level);
    id = parseInt(id);
    index = parseInt(index);
    let { target } = event;
    let container: string = "";
    if (target) {
      while (target && !target.classList.contains("card-container")) {
        target = target.parentElement;
      }
      container = target.id;
    }
    if (canDrop(from, id, container)) moveCards(from, id, container);
  };

  const canDrop = (from: string, id: number, container: string) => {
    const topCard = getTopCard(container);
    if (!topCard) return true;
    deck = new Deck();
    const draggedCard = getDraggedCard(from, id);
    if (
      draggedCard &&
      deck.faces.indexOf(topCard.face) ==
        deck.faces.indexOf(draggedCard.face) + 1
    )
      return true;
    return false;
  };

  const moveCards = (from: string, id: number, container: string) => {
    let Tableau: CardContainerType = { ...tableau };
    const toMove: Card[] = [];
    const [_1, idxF] = from.split("-");
    const [_2, idxT] = container.split("-");
    let found = false;
    while (!found && Tableau[`tableau-${idxF}`].length) {
      card = Tableau[`tableau-${idxF}`].pop();
      if (card) {
        toMove.push(card);
        if (card.id == id) found = true;
      }
    }
    while (toMove.length) {
      card = toMove.pop();
      if (card) Tableau[`tableau-${idxT}`].push(card);
    }
    moveCompleteSuits(Tableau);
  };

  const moveCompleteSuits = (Tableau: CardContainerType) => {
    let previous: Card | undefined,
      current: Card | undefined,
      length: number,
      counter: number;
    let toMove: Card[] = [];
    let Aces: CardContainerType = { ...aces };
    deck = new Deck();
    for (const id in Tableau) {
      length = Tableau[id].length;
      if (length >= 13) {
        previous = Tableau[id][length - 1];
        counter = 1;
        for (let i = length - 2; i >= 0; i--) {
          current = Tableau[id][i];
          if (current.facedown) break;
          if (current.suit != previous.suit) break;
          if (
            deck.faces.indexOf(current.face) !=
            deck.faces.indexOf(previous.face) + 1
          )
            break;
          counter++;
          previous = current;
        }
        if (counter >= 13) {
          toMove = [];
          while (toMove.length < 13) {
            card = Tableau[id].pop();
            if (card) toMove.push(card);
          }
          for (const aceId in Aces) {
            if (!Aces[aceId].length) {
              while (toMove.length) {
                card = toMove.pop();
                if (card) {
                  card.clickable = false;
                  card.draggable = false;
                  Aces[aceId].push(card);
                }
              }
              break;
            }
          }
        }
      }
    }
    setAces(Aces);
    adjustDraggable(Tableau);
  };

  const getTopCard = (container: string) => {
    const [_, idx] = container.split("-");
    let topCard: Card | undefined;
    if (tableau[`tableau-${idx}`].length) {
      topCard = tableau[`tableau-${idx}`][tableau[`tableau-${idx}`].length - 1];
    }
    return topCard;
  };

  const getDraggedCard = (from: string, id: number) => {
    const [_, idx] = from.split("-");
    let draggedCard: Card | undefined;
    if (tableau[`tableau-${idx}`].length) {
      draggedCard = tableau[`tableau-${idx}`].find((c) => c.id == id);
    }
    return draggedCard;
  };

  return (
    <div id="spider-game" className="m-2">
      <h1>Spider</h1>
      <div className="flex">
        <label htmlFor="suits" className="font-bold">
          Suits
        </label>
        <select
          name="suits"
          defaultValue={suits}
          onChange={suitChanged}
          className="mx-2"
        >
          {suitCounts.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={deal}>Deal</button>
      </div>

      <div className="flex flex-wrap justify-between mt-4">
        <div id="stock" className="card-container">
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
        <div className="flex flex-wrap">
          <div className="card-container" id="aces-0">
            {aces["aces-0"] &&
              aces["aces-0"].map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  from="aces-0"
                  index={index}
                  level={0}
                  click={() => {}}
                  dragStart={() => {}}
                />
              ))}
          </div>
          <div className="card-container ml-4" id="aces-1">
            {aces["aces-1"] &&
              aces["aces-1"].map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  from="aces-1"
                  index={index}
                  level={0}
                  click={() => {}}
                  dragStart={() => {}}
                />
              ))}
          </div>
          <div className="card-container ml-4" id="aces-2">
            {aces["aces-2"] &&
              aces["aces-2"].map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  from="aces-2"
                  index={index}
                  level={0}
                  click={() => {}}
                  dragStart={() => {}}
                />
              ))}
          </div>
          <div className="card-container ml-4" id="aces-3">
            {aces["aces-3"] &&
              aces["aces-3"].map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  from="aces-3"
                  index={index}
                  level={0}
                  click={() => {}}
                  dragStart={() => {}}
                />
              ))}
          </div>
          <div className="card-container ml-4" id="aces-4">
            {aces["aces-4"] &&
              aces["aces-4"].map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  from="aces-4"
                  index={index}
                  level={0}
                  click={() => {}}
                  dragStart={() => {}}
                />
              ))}
          </div>
          <div className="card-container ml-4" id="aces-5">
            {aces["aces-5"] &&
              aces["aces-5"].map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  from="aces-5"
                  index={index}
                  level={0}
                  click={() => {}}
                  dragStart={() => {}}
                />
              ))}
          </div>
          <div className="card-container ml-4" id="aces-6">
            {aces["aces-6"] &&
              aces["aces-6"].map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  from="aces-6"
                  index={index}
                  level={0}
                  click={() => {}}
                  dragStart={() => {}}
                />
              ))}
          </div>
          <div className="card-container ml-4" id="aces-7">
            {aces["aces-7"] &&
              aces["aces-7"].map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  from="aces-7"
                  index={index}
                  level={0}
                  click={() => {}}
                  dragStart={() => {}}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between mt-4">
        <div
          className="card-container"
          id="tableau-0"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-0"] &&
            tableau["tableau-0"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-0"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-1"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-1"] &&
            tableau["tableau-1"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-1"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-2"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-2"] &&
            tableau["tableau-2"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-2"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-3"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-3"] &&
            tableau["tableau-3"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-3"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-4"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-4"] &&
            tableau["tableau-4"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-4"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-5"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-5"] &&
            tableau["tableau-5"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-5"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-6"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-6"] &&
            tableau["tableau-6"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-6"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-7"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-7"] &&
            tableau["tableau-7"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-7"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-8"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-8"] &&
            tableau["tableau-8"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-8"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
        <div
          className="card-container"
          id="tableau-9"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDrop={drop}
        >
          {tableau["tableau-9"] &&
            tableau["tableau-9"].map((card, index) => (
              <PlayingCard
                key={card.id}
                from="tableau-9"
                level={index}
                index={index}
                card={card}
                dragStart={dragStart}
                click={() => {}}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
