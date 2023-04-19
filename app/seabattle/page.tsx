'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import SeaBattleGameOptions from './sea-battle-game-options'
import { SeaBattle } from '../../types/sea-battle.type'
import { apiUrl } from '../../lib/api-url'
import { buildRequestHeaders } from '../../lib/build-request-headers'
import { GameStatus } from '../../enum/game-status.enum'
import SeaBattleShipPlacement from './sea-battle-ship-placement'
import { PointType } from '@/types/point-type.type'
import { Navy } from '@/enum/navy.enum'
import { ShipTypeValue } from '@/enum/ship-type.enum'
import { SeaBattleShip } from '@/types/sea-batte-ship.type'
import { SeaBattleTurn } from '@/types/sea-battle-turn.type'
import SeaBattlePlayerTurn from './sea-battle-player-turn'
import SeaBattleOpponentTurn from './sea-battle-opponent-turn'
import useStorage, { SessionData, sessionKey } from '../../lib/session-storage'

export default function SeaBattleGame() {
	const [seaBattle, setSeaBattle] = useState<SeaBattle>({})
	const [shipsToPlace, setShipsToPlace] = useState<string[]>([])
	const [playerShips, setPlayerShips] = useState<SeaBattleShip[]>([])
	const [opponentShips, setOpponentShips] = useState<SeaBattleShip[]>([])
	const [playerTurns, setPlayerTurns] = useState<SeaBattleTurn[]>([])
	const [opponentTurns, setOpponentTurns] = useState<SeaBattleTurn[]>([])
	const [navy, setNavy] = useState<string>(Navy.Player)
	const [fired, setFired] = useState<boolean>(false)

	const { getItem } = useStorage()
	const session: SessionData = getItem(sessionKey, 'session')

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
				headers: buildRequestHeaders(session),
			})
			if (result.ok) {
				const game = await result.json()
				setSeaBattle(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const placeShip = (ev: any) => {
		const {
			ship: { Type, Size, Points },
		} = ev
		const current = [...shipsToPlace]
		const idx = current.indexOf(Type)
		console.log({ Type, idx })
		if (idx != -1) {
			current.splice(idx, 1)
			setShipsToPlace(current)
		}
		placePlayerShip(Type, Size, Points)
		placeOpponentShip(Type, Size)
	}

	const placePlayerShip = async (
		ShipType: string,
		Size: number,
		Points: PointType[]
	) => {
		if (!seaBattle.id) return
		try {
			const result = await fetch(
				`${apiUrl}/api/sea_battle/${seaBattle.id}/ship`,
				{
					method: 'POST',
					body: JSON.stringify({
						ShipType: ShipTypeValue[ShipType],
						Size,
						Navy: Navy.Player,
						Points,
					}),
					headers: buildRequestHeaders(),
				}
			)
			if (result.ok) {
				await result.json()
				reloadGame()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const placeOpponentShip = async (ShipType: string, Size: number) => {
		if (!seaBattle.id) return
		try {
			const result = await fetch(
				`${apiUrl}/api/sea_battle/${seaBattle.id}/ship`,
				{
					method: 'POST',
					body: JSON.stringify({
						ShipType: ShipTypeValue[ShipType],
						Size,
						Navy: Navy.Opponent,
					}),
					headers: buildRequestHeaders(),
				}
			)
			if (result.ok) {
				await result.json()
				reloadGame()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const reloadGame = async () => {
		if (!seaBattle.id) return
		try {
			const result = await fetch(`${apiUrl}/api/sea_battle/${seaBattle.id}`)
			if (result.ok) {
				const game: SeaBattle = await result.json()
				setSeaBattle(game)
				if (game.ships && game.ships.length > 0) {
					setPlayerShips(game.ships.filter((s) => s.Navy == Navy.Player))
					setOpponentShips(game.ships.filter((s) => s.Navy == Navy.Opponent))
				}
				if (game.turns && game.turns.length > 0) {
					setPlayerTurns(game.turns.filter((t) => t.Navy == Navy.Player))
					setOpponentTurns(game.turns.filter((t) => t.Navy == Navy.Opponent))
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const playerFire = async (ev: any) => {
		if (!seaBattle.id) return
		const {
			target: { Horizontal, Vertical },
		} = ev
		try {
			const result = await fetch(
				`${apiUrl}/api/sea_battle/${seaBattle.id}/fire`,
				{
					method: 'POST',
					body: JSON.stringify({ Horizontal, Vertical, Navy: Navy.Player }),
					headers: buildRequestHeaders(),
				}
			)
			if (result.ok) {
				await result.json()
				setFired(true)
				reloadGame()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const toggleOpponentTurn = () => {
		setNavy(Navy.Opponent)
		setFired(false)
	}

	const opponentFire = async (ev: any) => {
		if (!seaBattle.id) return
		try {
			const result = await fetch(
				`${apiUrl}/api/sea_battle/${seaBattle.id}/fire`,
				{
					method: 'POST',
					body: JSON.stringify({ Navy: Navy.Opponent }),
					headers: buildRequestHeaders(),
				}
			)
			if (result.ok) {
				await result.json()
				setFired(true)
				reloadGame()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const togglePlayerTurn = () => {
		setNavy(Navy.Player)
		setFired(false)
	}

	return (
		<div className="sea-battle-game m-2">
			<h1>Sea Battle</h1>
			{seaBattle.Status == GameStatus.Playing &&
				shipsToPlace.length == 0 &&
				seaBattle.Axis &&
				navy == Navy.Player && (
					<SeaBattlePlayerTurn
						axis={seaBattle.Axis}
						hasFired={fired}
						turns={playerTurns}
						ships={opponentShips}
						fire={playerFire}
						toggle={toggleOpponentTurn}
					/>
				)}
			{seaBattle.Status == GameStatus.Playing &&
				shipsToPlace.length == 0 &&
				seaBattle.Axis &&
				navy == Navy.Opponent && (
					<SeaBattleOpponentTurn
						axis={seaBattle.Axis}
						hasFired={fired}
						turns={opponentTurns}
						ships={playerShips}
						fire={opponentFire}
						toggle={togglePlayerTurn}
					/>
				)}
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
