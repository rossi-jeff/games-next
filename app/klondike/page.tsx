import React from 'react'
import Link from 'next/link'

export default function KlondikeGame() {
	return (
		<div className="klondike-game">
			<h1>Klondike</h1>
			<Link href="/klondike/scores">Scores</Link>
		</div>
	)
}
