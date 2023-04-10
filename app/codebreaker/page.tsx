import React from 'react'
import Link from 'next/link'

export default function CodeBreakerGame() {
	return (
		<div className="code-breaker-game">
			<h1>Code Breaker</h1>
			<Link href="/codebreaker/scores">Scores</Link>
		</div>
	)
}
