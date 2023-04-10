import React from 'react'
import Link from 'next/link'

export default function GuessWordGame() {
	return (
		<div className="guess-word-game">
			<h1>Guess Word</h1>
			<Link href="/guessword/scores">Scores</Link>
		</div>
	)
}
