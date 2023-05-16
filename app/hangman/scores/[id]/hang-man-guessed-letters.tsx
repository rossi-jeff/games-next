import { alphabet } from '../../../../lib/alphabet'

export default function HangManGuessedLetters({
	correct,
	wrong,
}: {
	correct: string
	wrong: string
}) {
	const letters: string[] = alphabet.toUpperCase().split('')

	const getClassName = (letter: string) => {
		const correctArr = correct
			.toUpperCase()
			.split(',')
			.filter((l) => l.length == 1)
		const wrongArr = wrong
			.toUpperCase()
			.split(',')
			.filter((l) => l.length == 1)
		if (correctArr.includes(letter)) return 'correct'
		if (wrongArr.includes(letter)) return 'wrong'
		return 'letter'
	}

	return (
		<div className="rounded-box">
			<div className="flex flex-wrap" id="hang-man-guessed-letters">
				{letters.map((letter) => (
					<div key={letter} className={getClassName(letter)}>
						{letter}
					</div>
				))}
			</div>
		</div>
	)
}
