'use client'

import { useEffect, useState } from 'react'
import { ShipTypeArray } from '../../enum/ship-type.enum'

export default function SeaBattleGameOptions({
	newGame,
}: {
	newGame: Function
}) {
	const [axis, setAxis] = useState<number>(8)
	const [ships, setShips] = useState<{ [key: string]: number }>({})
	const shipTypes: string[] = ShipTypeArray
	const perShipType: number[] = [0, 1, 2, 3]
	const axes: number[] = [6, 8, 10, 12]

	const setShipQty = (ev: any, shipType: string) => {
		const qty = perShipType[ev.target.selectedIndex]
		const current = { ...ships }
		current[shipType] = qty
		setShips(current)
	}

	const axisChanged = (ev: any) => {
		setAxis(axes[ev.target.selectedIndex])
	}

	const newGameClicked = () => {
		newGame({ axis, ships })
	}

	useEffect(() => {
		const s: { [key: string]: number } = {}
		for (const t of shipTypes) s[t] = 1
		setShips(s)
	}, [shipTypes])

	return (
		<div className="rounded-box">
			<div className="score-row py-1">
				<div>
					<label htmlFor="axis-select" className="inline-block font-bold w-24">
						Axis
					</label>
					<select
						name="axis-select"
						defaultValue={axis}
						onChange={(ev) => axisChanged(ev)}
					>
						{axes.map((a, i) => (
							<option key={i} value={a}>
								{a}
							</option>
						))}
					</select>
				</div>
			</div>
			{shipTypes.map((shipType, index) => (
				<div key={index} className="score-row py-1">
					<div className="ship-type-select-div">
						<label
							htmlFor={'ship-type-select-' + index}
							className="inline-block font-bold w-24"
						>
							{shipType}
						</label>
						<select
							name="ship-type-select"
							id={'ship-type-select-' + index}
							defaultValue={1}
							onChange={(ev) => setShipQty(ev, shipType)}
						>
							{perShipType.map((qty, i) => (
								<option key={index + '-' + i} value={qty}>
									{qty}
								</option>
							))}
						</select>
					</div>
				</div>
			))}
			<div className="score-row py-1">
				<div className="ml-24">
					<button onClick={newGameClicked}>New Game</button>
				</div>
			</div>
		</div>
	)
}
