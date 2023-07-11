export default function PokerSquaresDirections() {
  const toggle = (accordion: string) => {
    const btn = document.getElementById(`${accordion}-button`);
    if (btn) btn.classList.toggle("open");
    const content = document.getElementById(`${accordion}-content`);
    if (content) content.classList.toggle("open");
  };
  return (
    <div id="poker-squares-directions" className="directions-container">
      <button
        className="directions-button"
        id="poker-squares-directions-button"
        onClick={() => toggle("poker-squares-directions")}
      >
        Rules & Directions
      </button>
      <div id="poker-squares-directions-content" className="directions-content">
        <h3>Directions</h3>
        <div className="mb-2">
          Poker Squares is a patience game where the player will place 25 cards
          in a 5 by 5 grid in order to score ten poker hands. There are 5 hands
          horizonally in the rows, and 5 vertically in the columns. In this
          version the cards can be placed by using the column and row slects or
          by dragging and dropping.
        </div>
        <div className="mb-2">
          Hands are given point values as displayed in the chart below and the
          goal is to get the highest total score of all rows and columns.
        </div>
        <div className="mb-2">
          Play continues until all 25 cards have been placed.
        </div>
        <div className="mb-2">
          Additional info about{" "}
          <a
            href="https://en.wikipedia.org/wiki/Poker_squares"
            target="_blank"
            rel="noreferrer"
          >
            Poker Squares
          </a>
        </div>
        <h3>Hand Scores</h3>
        <ul>
          <li className="flex flex-wrap justify-between">
            <strong>Royal Straight Flush</strong>
            <strong>100</strong>
          </li>
          <li className="flex flex-wrap justify-between">
            <strong>Straight Flush</strong>
            <strong>75</strong>
          </li>
          <li className="flex flex-wrap justify-between">
            <strong>Four of a Kind</strong>
            <strong>50</strong>
          </li>
          <li className="flex flex-wrap justify-between">
            <strong>Full House</strong>
            <strong>25</strong>
          </li>
          <li className="flex flex-wrap justify-between">
            <strong>Flush</strong>
            <strong>20</strong>
          </li>
          <li className="flex flex-wrap justify-between">
            <strong>Straight</strong>
            <strong>15</strong>
          </li>
          <li className="flex flex-wrap justify-between">
            <strong>Three of a Kind</strong>
            <strong>10</strong>
          </li>
          <li className="flex flex-wrap justify-between">
            <strong>Two Pair</strong>
            <strong>5</strong>
          </li>
          <li className="flex flex-wrap justify-between">
            <strong>Pair</strong>
            <strong>2</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
