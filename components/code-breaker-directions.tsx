export default function CodeBreakerDirections() {
	const toggle = (accordion: string) => {
		const btn = document.getElementById(`${accordion}-button`)
		if (btn) btn.classList.toggle('open')
		const content = document.getElementById(`${accordion}-content`)
		if (content) content.classList.toggle('open')
	}
	return (
		<div id="code-breaker-directions" className="directions-container">
			<button
				className="directions-button"
				id="code-breaker-directions-button"
				onClick={() => toggle('code-breaker-directions')}
			>
				Rules & Directions
			</button>
			<div id="code-breaker-directions-content" className="directions-content">
				<h3>Directions</h3>
				<div className="mb-2">
					Code breaker is based on the paper and pencil game known as{' '}
					<b>bulls and cows</b>. A commercial version was released as{' '}
					<b>Master Mind</b>. A player will guess what they believe the code to
					be and a number of black and white keys will be returned rating their
					guess. A black key indicates the correct color is in the correct
					position and a white key indicates a correct color in the wrong
					position. This version is set up as solitaire and allows selection of
					both the colors to be used and the number of columns in the code.
				</div>
				<h3>Scoring</h3>
				<div className="mb-2">
					<ul>
						<li>
							<strong>Per Column</strong>
							10
						</li>
						<li>
							<strong>Per Color</strong>
							10
						</li>
						<li>
							<strong>Per Black Key</strong>
							10
						</li>
						<li>
							<strong>Per White Key</strong>5
						</li>
						<li>
							<strong>Max Guesses</strong>
							Number of columns * 2
						</li>
						<li>
							<strong>Per Guess</strong>
							Number of columns * per column
						</li>
						<li>
							<strong>Initial Max</strong>
							(max guesses * per guess) + (number of colors * per color)
						</li>
					</ul>
				</div>
				<div className="mb-2">
					<div className="mb-2">
						Scoring will begin by calculating the initial max. Each turn taken
						will subtract the per guess amount and add the number of white and
						black keys returned. The faster a player arrives at the solution,
						the higher the score.
					</div>
					<div>
						Additional info about{' '}
						<a
							href="https://en.wikipedia.org/wiki/Bulls_and_Cows"
							target="_blank"
							rel="noreferrer"
						>
							Bulls and Cows
						</a>{' '}
						and{' '}
						<a
							href="https://en.wikipedia.org/wiki/Mastermind_(board_game)"
							target="_blank"
							rel="noreferrer"
						>
							Master Mind
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
