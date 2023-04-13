'use client'

import { SeaBattleMaxAxis } from '@/lib/sea-battle-max-axis'
import { SeaBattleShip } from '@/types/sea-batte-ship.type'
import { SeaBattleTurn } from '@/types/sea-battle-turn.type'
import { useEffect } from 'react'

export default function SeaBattleOpponentTurn({
	axis,
	ships,
	turns,
	hasFired,
	fire,
	toggle,
}: {
	axis: number
	ships: SeaBattleShip[]
	turns: SeaBattleTurn[]
	hasFired: boolean
	fire: Function
	toggle: Function
}) {
	const horizontal = SeaBattleMaxAxis.H.slice(0, axis)
	const vertical = SeaBattleMaxAxis.V.slice(0, axis)

	const fireClicked = () => {
		fire()
	}

	const toggleClicked = () => {
		toggle()
	}

	useEffect(() => {
		let el
		for (const ship of ships) {
			if (ship.points) {
				for (const point of ship.points) {
					el = document.getElementById(
						`OT-${point.Vertical}-${point.Horizontal}`
					)
					if (el) {
						el.classList.add('occupied')
					}
				}
			}
		}
	}, [ships])

	useEffect(() => {
		let el
		for (const turn of turns) {
			el = document.getElementById(`OT-${turn.Vertical}-${turn.Horizontal}`)
			if (el) {
				if (turn.Target) el.classList.add(turn.Target)
			}
		}
	}, [turns])

	return (
		<div className="rounded-box">
			<h1 className="ml-2">Opponent Turn</h1>
			<div className="flex flex-wrap">
				<div className="sea-battle-opponent-grid">
					<div className="grid-row">
						<div className="grid-header-cell"></div>
						{horizontal.map((H) => (
							<div key={'og-th-' + H} className="grid-header-cell">
								{H}
							</div>
						))}
					</div>
					{vertical.map((V) => (
						<div key={'og-r-' + V} className="grid-row">
							<div className="grid-header-cell">{V}</div>
							{horizontal.map((H) => (
								<div
									key={'ot-c-' + V + '-' + H}
									className="grid-cell"
									id={'OT-' + V + '-' + H}
								>
									<span></span>
								</div>
							))}
						</div>
					))}
				</div>
				<div className="p-2">
					{hasFired ? (
						<button onClick={toggleClicked}>Player Turn</button>
					) : (
						<button onClick={fireClicked}>Fire</button>
					)}
				</div>
			</div>
		</div>
	)
}
