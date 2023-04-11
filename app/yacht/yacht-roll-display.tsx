'use client'

import { useEffect, useState } from 'react'
import DieLarge from '../../components/die-large'

export default function YachtRollDisplay({
	roll,
	heading,
	label,
	rollDice,
	flag,
}: {
	roll: string
	heading: string
	label: string
	rollDice: Function
	flag: boolean
}) {
	const [dice, setDice] = useState<number[]>([])
	const [checked, setChecked] = useState<number[]>([])

	useEffect(() => {
		let d: number[] = roll
			.split(',')
			.filter((die) => die.length == 1)
			.map((die) => parseInt(die))
		setDice(d)
	}, [roll])

	const cbChanged = (ev: any) => {
		let { value } = ev.target
		value = parseInt(value)
		let selected = checked
		let idx = selected.indexOf(value)
		if (idx == -1) {
			selected.push(value)
		} else {
			selected.splice(idx, 1)
		}
		setChecked(selected)
	}

	const clickRoll = () => {
		let keep: number[] = []
		for (const idx of checked) keep.push(dice[idx])
		rollDice({ keep })
	}

	return (
		<div className="rounded-box">
			<h2>{heading}</h2>
			<div className="flex flex-wrap">
				{dice.map((d, i) => (
					<div key={i} className="p-2">
						<DieLarge
							face={d}
							index={i}
							heading={heading}
							draggable={false}
							dragStart={() => {}}
						/>
						<div className="text-center m-0">
							<input
								type="checkbox"
								value={i}
								onChange={cbChanged}
								disabled={flag}
							/>
						</div>
					</div>
				))}
			</div>
			{!flag && <button onClick={() => clickRoll()}>{label}</button>}
		</div>
	)
}
