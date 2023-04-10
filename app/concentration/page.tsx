import React from 'react'
import Link from 'next/link'

export default function ConcentrationGame() {
	return (
		<div className="concentration-game">
			<h1>Concentration</h1>
			<Link href="/concentration/scores">Scores</Link>
		</div>
	)
}
