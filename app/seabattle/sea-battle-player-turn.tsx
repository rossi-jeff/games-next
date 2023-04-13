'use client'

import { SeaBattleMaxAxis } from '@/lib/sea-battle-max-axis'
import { PointType } from '@/types/point-type.type'
import { SeaBattleShip } from '@/types/sea-batte-ship.type'
import { SeaBattleTurn } from '@/types/sea-battle-turn.type'
import { useEffect, useState } from 'react'
import SeaBattleShipDisplay from './sea-battle-ship-display'

export default function SeaBattlePlayerTurn({
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

	const [target, setTarget] = useState<PointType>({
		Horizontal: horizontal[0],
		Vertical: vertical[0],
	})
	const [errors, setErrors] = useState<string[]>([])

	const horizontalChanged = (ev: any) => {
		const Horizontal = horizontal[ev.target.selectedIndex]
		setTarget({
			...target,
			Horizontal,
		})
		highlightPoint()
	}

	const verticalChanged = (ev: any) => {
		const Vertical = vertical[ev.target.selectedIndex]
		setTarget({
			...target,
			Vertical,
		})
		highlightPoint()
	}

	const highlightPoint = () => {
		let el, H: string | undefined, V: number | undefined
		const e: string[] = []
		const highlighted = document.getElementsByClassName('highlighted')
		for (let i = 0; i < highlighted.length; i++) {
			el = document.getElementById(highlighted[i].id)
			if (el) el.classList.remove('highlighted')
		}
		el = document.getElementById('target-horizontal') as HTMLSelectElement
		if (el) H = horizontal[el.selectedIndex]
		el = document.getElementById('target-vertical') as HTMLSelectElement
		if (el) V = vertical[el.selectedIndex]
		if (H && V) {
			if (turns.find((t) => t.Horizontal == H && t.Vertical == V)) {
				e.push('Please choose a point that has not been fired')
			} else {
				el = document.getElementById(`PT-${V}-${H}`)
				if (el) el.classList.add('highlighted')
			}
		} else {
			if (!H) e.push('Please select horizontal')
			if (!V) e.push('Please select vertical')
		}
		setErrors(e)
	}

	const fireClicked = () => {
		const { Horizontal, Vertical } = target
		if (Horizontal && Vertical) {
			fire({ target })
			const highlighted = document.getElementsByClassName('highlighted')
			for (let i = 0; i < highlighted.length; i++) {
				const el = document.getElementById(highlighted[i].id)
				if (el) el.classList.remove('highlighted')
			}
		} else {
			const e: string[] = []
			if (!Horizontal) e.push('Please select horizontal')
			if (!Vertical) e.push('Please select vertical')
			setErrors(e)
		}
	}

	const toggleClicked = () => {
		toggle()
	}

	useEffect(() => {
		let el
		for (const turn of turns) {
			el = document.getElementById(`PT-${turn.Vertical}-${turn.Horizontal}`)
			if (el) {
				if (turn.Target) el.classList.add(turn.Target)
			}
		}
	}, [turns])

	return (
		<div className="rounded-box">
			<h1 className="ml-2">Player Turn</h1>
			<div className="flex flex-wrap">
				<div className="sea-battle-player-grid">
					<div className="grid-row">
						<div className="grid-header-cell"></div>
						{horizontal.map((H) => (
							<div key={'pg-th-' + H} className="grid-header-cell">
								{H}
							</div>
						))}
					</div>
					{vertical.map((V) => (
						<div key={'pg-r-' + V} className="grid-row">
							<div className="grid-header-cell">{V}</div>
							{horizontal.map((H) => (
								<div
									key={'pt-c-' + V + '-' + H}
									className="grid-cell"
									id={'PT-' + V + '-' + H}
								>
									<span></span>
								</div>
							))}
						</div>
					))}
				</div>
				<div>
					{hasFired ? (
						<button className="m-2" onClick={toggleClicked}>
							Opponent Turn
						</button>
					) : (
						<div className="p-2">
							<div className="score-row py-1">
								<div>
									<label
										htmlFor="target-horizontal"
										className="inline-block font-bold w-24"
									>
										Horizontal
									</label>
									<select
										name="target-horizontal"
										defaultValue={horizontal[0]}
										onChange={(ev) => horizontalChanged(ev)}
										id="target-horizontal"
									>
										{horizontal.map((H, i) => (
											<option key={i} value={H}>
												{H}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="score-row py-1">
								<div>
									<label
										htmlFor="target-vertical"
										className="inline-block font-bold w-24"
									>
										Vertical
									</label>
									<select
										name="target-vertical"
										defaultValue={vertical[0]}
										onChange={(ev) => verticalChanged(ev)}
										id="target-vertical"
									>
										{vertical.map((V, i) => (
											<option key={i} value={V}>
												{V}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="score-row py-1">
								{errors.length > 0 ? (
									<ul>
										{errors.map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								) : (
									<button className="ml-24" onClick={fireClicked}>
										Fire
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-wrap p-2">
				{ships.map((ship) => (
					<SeaBattleShipDisplay key={ship.id} ship={ship} />
				))}
			</div>
		</div>
	)
}
