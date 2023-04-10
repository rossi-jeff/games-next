import React from 'react'
import Link from 'next/link'

export default function TenGrandGame() {
	return (
		<div className="ten-grand-game">
			<h1>Ten Grand</h1>
			<Link href="/tengrand/scores">Scores</Link>
		</div>
	)
}
