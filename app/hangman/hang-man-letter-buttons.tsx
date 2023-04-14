'use client'

import { useEffect } from 'react'
import { alphabet } from '../../lib/alphabet'

export default function HangManLetterButtons({
	correct,
	wrong,
	guess,
}: {
	correct: string
	wrong: string
	guess: Function
}) {
	const letters: string[] = alphabet.toUpperCase().split('')

	const guessClicked = (letter: string) => {
		guess({ letter })
	}

	useEffect(() => {
		let el
		for (const letter of letters) {
			el = document.getElementById(`letter-${letter}`) as HTMLButtonElement
			if (el) {
				el.disabled = false
				el.classList.remove('correct')
				el.classList.remove('wrong')
			}
		}
		const letterC = correct
			.toUpperCase()
			.split(',')
			.filter((l) => l.length == 1)
		for (const letter of letterC) {
			el = document.getElementById(`letter-${letter}`) as HTMLButtonElement
			if (el) {
				el.disabled = true
				el.classList.add('correct')
			}
		}
		const letterW = wrong
			.toUpperCase()
			.split(',')
			.filter((l) => l.length == 1)
		for (const letter of letterW) {
			el = document.getElementById(`letter-${letter}`) as HTMLButtonElement
			if (el) {
				el.disabled = true
				el.classList.add('wrong')
			}
		}
	}, [correct, wrong, letters])

	return (
		<div className="rounded-box">
			<div className="flex flex-wrap">
				{letters.map((letter) => (
					<button
						className="letter"
						key={letter}
						onClick={() => guessClicked(letter)}
						id={'letter-' + letter}
					>
						{letter}
					</button>
				))}
			</div>
		</div>
	)
}
