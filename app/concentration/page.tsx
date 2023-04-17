"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Concentration } from "@/types/concentration.type";
import { GameStatus } from "@/enum/game-status.enum";
import { Deck } from "@/lib/deck.class";
import { Card } from "@/lib/card.class";
import { formatElapsed } from "@/lib/clock.class";
import PlayingCard from "@/components/playing-card";

type ClickedCardType = { first: number; second: number };

export default function ConcentrationGame() {
  let deck: Deck | undefined;
  const [concentration, setConcentration] = useState<Concentration>({});
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [cards, setCards] = useState<Card[]>([]);
  const [firstCard, setFirstCard] = useState(-1);
  const [secondCard, setSecondCard] = useState(-1);
  const [clickedCards, setClickedCards] = useState<ClickedCardType>({
    first: -1,
    second: -1,
  });

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
  const deal = () => {
    deck = new Deck();
    deck.preload();
    deck.shuffle();
    deck.cards.map((c) => (c.clickable = true));
    setCards(deck.cards);
    setMoves(0);
    setMatches(0);
  };

  const quit = () => {};

  const cardClicked = (event: any) => {
    const { id } = event;
    const index = parseInt(id.split("_")[3]);
    let Cards: Card[] = [...cards];
    const card = Cards[index];
    if (card && !card.visible) return;
    if (clickedCards.first != -1) {
      setClickedCards({
        first: clickedCards.first,
        second: index,
      });
      timeout.current = setTimeout(() => handleCards(), 2000);
    } else {
      setClickedCards({
        first: index,
        second: -1,
      });
    }
    card.facedown = false;
    setCards(Cards);
  };

  const handleCards = () => {
    console.log("handleCards");
    let Cards: Card[] = [...cards];
    const card1 = Cards[clickedCards.first];
    const card2 = Cards[clickedCards.second];
    console.log({ card1, card2, clickedCards });
    if (card1 && card2 && card1.face == card2.face) {
      card1.visible = false;
      card2.visible = false;
      setMatches(matches + 1);
    } else {
      if (card1) card1.facedown = true;
      if (card2) card2.facedown = true;
    }
    setClickedCards({ first: -1, second: -1 });
    setCards(Cards);
  };

  return (
    <div id="concentration-game" className="m-2">
      <h1>Concentration</h1>
      <div className="flex flex-wrap justify-between">
        <div>
          {concentration.Status != GameStatus.Playing && (
            <button onClick={deal}>Deal</button>
          )}
          {concentration.Status == GameStatus.Playing && (
            <button onClick={quit}>Quit</button>
          )}
        </div>
        <div>
          <strong className="mr-2">Status</strong>
          {concentration.Status ? concentration.Status : "N/A"}
        </div>
        <div>
          <strong className="mr-2">Moves</strong>
          {moves}
        </div>
        <div>
          <strong className="mr-2">Matches</strong>
          {matches}
        </div>
        <div>
          <strong className="mr-2">Time</strong>
          {formatElapsed(elapsed)}
        </div>
      </div>
      <div className="flex flex-wrap my-2">
        {cards.length > 0 &&
          cards.map((card, index) => (
            <div
              key={index}
              id={"container-" + card.id}
              className="card-container mr-2 mb-2"
            >
              <PlayingCard
                key={card.id}
                index={index}
                level={0}
                card={card}
                dragStart={() => {}}
                click={cardClicked}
                from="concentration"
              />
            </div>
          ))}
      </div>
      <Link href="/concentration/scores">Scores</Link>
    </div>
  );
}
