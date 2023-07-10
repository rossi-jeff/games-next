export default function GuessWordDirections() {
	const toggle = (accordion: string) => {
		const btn = document.getElementById(`${accordion}-button`)
		if (btn) btn.classList.toggle('open')
		const content = document.getElementById(`${accordion}-content`)
		if (content) content.classList.toggle('open')
	}
	return (
		<div id="guess-word-directions" className="directions-container">
			<button
				className="directions-button"
				id="guess-word-directions-button"
				onClick={() => toggle('guess-word-directions')}
			>
				Rules & Directions
			</button>
			<div id="guess-word-directions-content" className="directions-content">
				<h3>Directions</h3>
				<div className="mb-2">
					Guess word is based on the pencil and paper word game <b>Jotto</b>{' '}
					along with some ideas from the popular word game <b>Wordle</b>. This
					version is designed to be played as solitaire, and allows selection of
					the word length.
				</div>
				<h3>Scoring</h3>
				<div className="mb-2">
					<ul>
						<li>
							<strong>Per Green</strong>
							10
						</li>
						<li>
							<strong>Per Brown</strong>5
						</li>
						<li>
							<strong>Per Letter</strong>
							10
						</li>
						<li>
							<strong>Per Guess</strong>
							Word length * per letter
						</li>
						<li>
							<strong>Max Guesses</strong>
							(word length * 3) / 2 rounded up
						</li>
						<li>
							<strong>Initial Max</strong>
							max guesses * per guess
						</li>
					</ul>
					<div className="mb-2">
						Scoring will begin by calculating the initial max. Each turn taken
						will subtract the per guess amount and add the number of green and
						brown ratings returned. The faster a player arrives at the solution,
						the higher the score.
					</div>
					<div>
						Additional info about
						<a
							href="https://en.wikipedia.org/wiki/Jotto"
							target="_blank"
							rel="noreferrer"
						>
							Jotto
						</a>
						and
						<a
							href="https://en.wikipedia.org/wiki/Wordle"
							target="_blank"
							rel="noreferrer"
						>
							Wordle
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
