import React from "react";
import Link from "next/link";

export default function YachtGame() {
  return (
    <div className="yacht-game">
      <h1>Yacht</h1>
      <Link href="/yacht/scores">Scores</Link>
    </div>
  );
}
