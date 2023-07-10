'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Yacht } from '../../types/yacht.type'
import YachtPlaying from './yacht-playing'
import { apiUrl } from '../../lib/api-url'
import { buildRequestHeaders } from '../../lib/build-request-headers'
import YachtScoreCard from './yacht-score-card'
import useStorage, { SessionData, sessionKey } from '../../lib/session-storage'
import YachtDirections from '../../components/yacht-directions'

export default function YachtGame() {
	const [yacht, setYacht] = useState<Yacht>({})

	const { getItem } = useStorage()
	const session: SessionData = getItem(sessionKey, 'session')

	const createGame = async () => {
		try {
			const result = await fetch(`${apiUrl}/api/yacht`, {
				method: 'POST',
				headers: buildRequestHeaders(session),
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
		<div className="m-2">
			<div className="flex flex-wrap justify-between">
				<h1>Yacht</h1>
				<Link href="/yacht/scores">Scores</Link>
			</div>

			{yacht && yacht.NumTurns != undefined && yacht.NumTurns < 12 ? (
				<YachtPlaying yacht={yacht} reloadGame={reloadGame} />
			) : (
				<>
					<button onClick={createGame} className="mb-2">
						New Game
					</button>
					<YachtDirections />
				</>
			)}
			{yacht.Total != undefined &&
				yacht.turns != undefined &&
				yacht.turns.length > 0 && (
					<YachtScoreCard total={yacht.Total} turns={yacht.turns} />
				)}
		</div>
	)
}
