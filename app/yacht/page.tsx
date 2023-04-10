'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Yacht } from '../../types/yacht.type'
import YachtPlaying from './yacht-playing'
import { apiUrl } from '../../lib/api-url'
import { buildRequestHeaders } from '../../lib/build-request-headers'

export default function YachtGame() {
	const [yacht, setYacht] = useState<Yacht>({})

	const createGame = async () => {
		try {
			const result = await fetch(`${apiUrl}/api/yacht`, {
				method: 'POST',
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const game = await result.json()
				setYacht(game)
				console.log({ game })
			}
		} catch (error) {
			console.log(error)
		}
	}

	const reloadGame = async () => {
		if (!yacht.id) return
		try {
			const result = await fetch(`${apiUrl}/api/yacht/${yacht.id}`, {
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const game = await result.json()
				setYacht(game)
				console.log({ game })
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="yacht-game">
			<h1>Yacht</h1>
			{yacht && yacht.NumTurns != undefined && yacht.NumTurns < 12 ? (
				<YachtPlaying yacht={yacht} reloadGame={reloadGame} />
			) : (
				<button onClick={createGame}>New Game</button>
			)}
			<div>
				<Link href="/yacht/scores">Scores</Link>
			</div>
		</div>
	)
}
