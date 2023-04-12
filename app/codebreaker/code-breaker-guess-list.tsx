import { CodeBreakerGuess } from '../../types/code-breaker-guess.type'

export default function CodeBreakerGuessList({
	guesses,
}: {
	guesses: CodeBreakerGuess[]
}) {
	return (
		<div className="rounded-box">
			{guesses.map((guess) => (
				<div key={guess.id} className="score-row">
					<div className="code-breaker-guess-colors">
						{guess.colors &&
							guess.colors.length > 0 &&
							guess.colors.map((color) => (
								<div key={color.id} className={color.Color}></div>
							))}
					</div>
					<div className="code-breaker-guess-keys">
						{guess.keys &&
							guess.keys.length > 0 &&
							guess.keys.map((key) => (
								<div key={key.id} className={key.Key}></div>
							))}
					</div>
				</div>
			))}
		</div>
	)
}
