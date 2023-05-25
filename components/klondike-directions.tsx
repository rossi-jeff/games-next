export default function KlondikeDirections() {
	const toggle = (accordion: string) => {
		const btn = document.getElementById(`${accordion}-button`)
		if (btn) btn.classList.toggle('open')
		const content = document.getElementById(`${accordion}-content`)
		if (content) content.classList.toggle('open')
	}
	return (
		<div id="klondike-directions" className="directions-container">
			<button
				className="directions-button"
				id="klondike-directions-button"
				onClick={() => toggle('klondike-directions')}
			>
				Rules & Directions
			</button>
			<div id="klondike-directions-content" className="directions-content">
				<h3>Directions</h3>
				<div className="mb-2">
					Klondike is also known as Canfield. In this game a standard deck of 52
					cards is shuffled and dealt in to seven piles known as the tableau in
					increasing amounts from 1 to 7. The top card of each pile is turned
					face up. The remaining cards are placed face down in a pile called the
					stock.
				</div>
				<div className="mb-2">
					Four spots are designated to hold piles of the same suit from ace to
					king and are known as the foundation. The goal of the game is to move
					all 52 cards to the foundation.
				</div>
				<div className="mb-2">
					During play a card or series of cards may be moved from one tableau to
					another with the top card in the target tableau being of opposite
					color and one face higher. Only a king can be placed into an empty
					tableau location. At any time a card may be moved up to the
					foundation, but cannot be moved back own to the tableau.
				</div>
				<div className="mb-2">
					There are several variants as to how the cards in the stock are turned
					face up into a pile known as the waste. In this version cards are
					turned one at a time with a maximum of three times through the stock.
					Cards in the waste can be moved one at a time to the tableau or the
					foundation.
				</div>
				<div className="mb-2">
					Play continues until all cards are in the foundation or no more moves
					can be made.
				</div>
				<div className="mb-2">
					Additional info about{' '}
					<a
						href="https://en.wikipedia.org/wiki/Klondike_(solitaire)"
						target="_blank"
						rel="noreferrer"
					>
						Klondike
					</a>
				</div>
				<h3>Scoring</h3>
				<div className="mb-2">
					This version is designed as solitaire and the goal is to complete in
					the shortest time.
				</div>
			</div>
		</div>
	)
}