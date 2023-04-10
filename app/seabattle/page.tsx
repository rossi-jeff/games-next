import React from 'react'
import Link from 'next/link'

export default function SeaBattleGame() {
	return (
		<div className="sea-battle-game">
			<h1>Sea Battle</h1>
			<Link href="/seabattle/scores">Scores</Link>
		</div>
	)
}
