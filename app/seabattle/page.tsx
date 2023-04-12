'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import SeaBattleGameOptions from './sea-battle-game-options'
import { SeaBattle } from '../../types/sea-battle.type'
import { apiUrl } from '../../lib/api-url'
import { buildRequestHeaders } from '../../lib/build-request-headers'
import { GameStatus } from '../../enum/game-status.enum'
import SeaBattleShipPlacement from './sea-battle-ship-placement'

export default function SeaBattleGame() {
	const [seaBattle, setSeaBattle] = useState<SeaBattle>({})
	const [shipsToPlace, setShipsToPlace] = useState<string[]>([])

	const newGame = async (ev: any) => {
		const { axis: Axis, ships } = ev
		const toPlace: string[] = []
		for (const shipType in ships) {
			for (let i = 0; i < ships[shipType]; i++) toPlace.push(shipType)
		}
		setShipsToPlace(toPlace)
		try {
			const result = await fetch(`${apiUrl}/api/sea_battle`, {
				method: 'POST',
				body: JSON.stringify({ Axis }),
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const game = await result.json()
				setSeaBattle(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const placeShip = async (ev: any) => {
		console.log(ev)
	}
	return (
		<div className="sea-battle-game m-2">
			<h1>Sea Battle</h1>
			{seaBattle.Status == GameStatus.Playing &&
				shipsToPlace.length > 0 &&
				seaBattle.Axis != undefined && (
					<SeaBattleShipPlacement
						axis={seaBattle.Axis}
						shipsToPlace={shipsToPlace}
						placeShip={placeShip}
					/>
				)}
			{seaBattle.Status != GameStatus.Playing && (
				<SeaBattleGameOptions newGame={newGame} />
			)}
			<Link href="/seabattle/scores">Scores</Link>
		</div>
	)
}
