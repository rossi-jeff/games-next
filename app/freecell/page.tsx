import React from 'react'
import Link from 'next/link'

export default function FreeCellGame() {
	return (
		<div className="free-cell-game">
			<h1>Free Cell</h1>
			<Link href="/freecell/scores">Scores</Link>
		</div>
	)
}
