'use client'
import { useEffect, useState } from 'react'
import DieSmall from './die-small'

export default function SmallDiceRow({ roll }: { roll: string }) {
	const [dice, setDice] = useState<number[]>([])
	useEffect(() => {
		let d: number[] = roll
			.split(',')
			.filter((die) => die.length == 1)
			.map((die) => parseInt(die))
		setDice(d)
	}, [roll])
	return (
		<div className="flex flex-wrap">
			{dice.length > 0 &&
				dice.map((face, i) => <DieSmall key={i} face={face} />)}
		</div>
	)
}
