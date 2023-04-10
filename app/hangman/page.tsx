import React from 'react'
import Link from 'next/link'

export default function HangManGame() {
	return (
		<div className="hang-man-game">
			<h1>Hang Man</h1>
			<Link href="/hangman/scores">Scores</Link>
		</div>
	)
}
