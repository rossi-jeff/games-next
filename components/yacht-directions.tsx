export default function YachtDirections() {
	const toggle = (accordion: string) => {
		const btn = document.getElementById(`${accordion}-button`)
		if (btn) btn.classList.toggle('open')
		const content = document.getElementById(`${accordion}-content`)
		if (content) content.classList.toggle('open')
	}
	return (
		<div id="yacht-directions" className="directions-container">
			<button
				className="directions-button"
				id="yacht-directions-button"
				onClick={() => toggle('yacht-directions')}
			>
				Rules & Directions
			</button>
			<div id="yacht-directions-content" className="directions-content">
				<h3>Directions</h3>
				<div className=" mb-2">
					<div className="mb-2">
						Yacht is public domain a dice game played with five dice over a
						series of twelve turns. This version is structured as a solitaire
						game.
					</div>
					<div>
						A game consists of 12 rounds, one for each scoring category. In each
						turn the player will have a maximum of three dice rolls. After each
						roll the player may choose to keep some of the dice to be included
						in the next roll. At the end of the 3rd roll or after any roll the
						player may choose to assign the category to the roll and receive the
						resulting score.
					</div>
					<div className="mt-2">
						<a
							href="https://en.wikipedia.org/wiki/Yacht_(dice_game)"
							target="_blank"
							rel="noreferrer"
						>
							Additional info from Wikipedia
						</a>
					</div>
				</div>
				<h3>Scoring</h3>
				<div className="scoring-grid">
					<div className="scoring-grid-row">
						<div className="category">Ones</div>
						<div className="description">Any combination</div>
						<div className="score">Sum of all 1 faces</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Twos</div>
						<div className="description">Any combination</div>
						<div className="score">Sum of all 2 faces</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Threes</div>
						<div className="description">Any combination</div>
						<div className="score">Sum of all 3 faces</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Fours</div>
						<div className="description">Any combination</div>
						<div className="score">Sum of all 4 faces</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Fives</div>
						<div className="description">Any combination</div>
						<div className="score">Sum of all 5 faces</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Sixes</div>
						<div className="description">Any combination</div>
						<div className="score">Sum of all 6 faces</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Full House</div>
						<div className="description">
							Threee of one face and two of another
						</div>
						<div className="score">25</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Four of a Kind</div>
						<div className="description">Four of one face</div>
						<div className="score">Sum of four dice</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Little Straight</div>
						<div className="description">1-2-3-4-5</div>
						<div className="score">30</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Big Straight</div>
						<div className="description">2-3-4-5-6</div>
						<div className="score">30</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Choice</div>
						<div className="description">Any combination</div>
						<div className="score">Sum of all 5 dice</div>
					</div>

					<div className="scoring-grid-row">
						<div className="category">Yacht</div>
						<div className="description">Five of one face</div>
						<div className="score">50</div>
					</div>
				</div>
			</div>
		</div>
	)
}
