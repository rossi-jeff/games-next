export default function ConcentrationDirections() {
	const toggle = (accordion: string) => {
		const btn = document.getElementById(`${accordion}-button`)
		if (btn) btn.classList.toggle('open')
		const content = document.getElementById(`${accordion}-content`)
		if (content) content.classList.toggle('open')
	}
	return (
		<div id="concentration-directions" className="directions-container">
			<button
				className="directions-button"
				id="concentration-directions-button"
				onClick={() => toggle('concentration-directions')}
			>
				Rules & Directions
			</button>
			<div id="concentration-directions-content" className="directions-content">
				<h3>Directions</h3>
				<div className="mb-2">
					A standard deck of 52 cards is shuffled and placed face down. The
					player will click two cards to flip them over. If the cards have the
					same face they are removed. Other variants require matching both the
					face and the color. If the cards do not match they are turned face
					down again and the player will turn over to more cards.
				</div>
				<div className="mb-2">
					Play will continuue until all cards have been removed.
				</div>
				<div className="mb-2">
					Additional info about{' '}
					<a
						href="https://en.wikipedia.org/wiki/Concentration_(card_game)"
						target="_blank"
						rel="noreferrer"
					>
						Concentration
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
