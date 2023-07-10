export default function HangManDiections() {
	const toggle = (accordion: string) => {
		const btn = document.getElementById(`${accordion}-button`)
		if (btn) btn.classList.toggle('open')
		const content = document.getElementById(`${accordion}-content`)
		if (content) content.classList.toggle('open')
	}
	return (
		<div id="hang-man-directions" className="directions-container">
			<button
				className="directions-button"
				id="hang-man-directions-button"
				onClick={() => toggle('hang-man-directions')}
			>
				Rules & Directions
			</button>
			<div id="hang-man-directions-content" className="directions-content">
				<h3>Directions</h3>
				<div className="mb-2">
					The player will guess letters sequentially until either the word is
					guessed or enough wrong guesses are made to lose the game.
				</div>
				<h3>Scoring</h3>
				<div className="mb-2">
					<div className="mb-2">
						<ul>
							<li>
								<strong>Per Distict Letter</strong>
								10
							</li>
							<li>
								<strong>Per Correct</strong>5
							</li>
							<li>
								<strong>Per Wrong</strong>
								-10
							</li>
							<li>
								<strong>Initial if Won</strong>
								Number of distict letters * per distict letter
							</li>
						</ul>
					</div>
					<div className="mb-2">
						Scoring will begin with either the initial or zero depending upon
						game status. The score will be adjusted according to the quantity of
						letters correct and wrong.
					</div>
					<div>
						Additional info about{' '}
						<a
							href="https://en.wikipedia.org/wiki/Hangman_(game)"
							target="_blank"
							rel="noreferrer"
						>
							Hang Man
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
