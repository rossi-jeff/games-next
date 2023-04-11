'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { TenGrand } from '../../types/ten-grand.type'
import { GameStatus } from '../../enum/game-status.enum'
import TenGrandPlaying from './ten-grand-playing'
import { apiUrl } from '../../lib/api-url'
import { buildRequestHeaders } from '../../lib/build-request-headers'
import TenGrandScoreCard from './ten-grand-score-card'

export default function TenGrandGame() {
	const [tenGrand, setTenGrand] = useState<TenGrand>({})

	const createGame = async () => {
		try {
			const result = await fetch(`${apiUrl}/api/ten_grand`, {
				method: 'POST',
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const game = await result.json()
				setTenGrand(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const reloadGame = async () => {
		if (!tenGrand.id) return
		try {
			const result = await fetch(`${apiUrl}/api/ten_grand/${tenGrand.id}`)
			if (result.ok) {
				const game = await result.json()
				setTenGrand(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="m-2">
			<h1>Ten Grand</h1>
			{tenGrand && tenGrand.Status == GameStatus.Playing ? (
				<TenGrandPlaying tenGrand={tenGrand} reloadGame={reloadGame} />
			) : (
				<div className="mb-2">
					<button onClick={createGame}>New Game</button>
				</div>
			)}
			{tenGrand && tenGrand.turns != undefined && tenGrand.turns.length > 0 && (
				<TenGrandScoreCard turns={tenGrand.turns} />
			)}
			<Link href="/tengrand/scores">Scores</Link>
		</div>
	)
}
