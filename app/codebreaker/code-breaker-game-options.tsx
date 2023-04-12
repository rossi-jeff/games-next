'use client'

import { useState } from 'react'
import { ColorArray } from '../../enum/color.enum'

export default function CodeBreakerGameOptions({
	newGame,
}: {
	newGame: Function
}) {
	const colors: string[] = ColorArray
	const columns: number[] = [4, 5, 6, 7, 8]
	const [selected, setSelected] = useState<{
		Colors: string[]
		Columns: number
	}>({
		Colors: [],
		Columns: 4,
	})

	const checkAll = () => {
		setSelected({
			Columns: selected.Columns,
			Colors: ColorArray,
		})
	}

	const colorsChanged = (ev: any) => {
		const { value } = ev.target
		const current: string[] = [...selected.Colors]
		const idx = current.indexOf(value)
		if (idx == -1) {
			current.push(value)
		} else {
			current.splice(idx, 1)
		}
		setSelected({
			Columns: selected.Columns,
			Colors: current,
		})
	}

	const columnsChanged = (ev: any) => {
		setSelected({
			Colors: [...selected.Colors],
			Columns: columns[ev.target.selectedIndex],
		})
	}

	const newGameClicked = () => {
		newGame(selected)
	}
	return (
		<div className="rounded-box flex flex-wrap justify-between">
			<div id="color-checks" className="flex flex-wrap">
				<button className="mr-2" onClick={checkAll}>
					Check All
				</button>
				{colors.map((color, i) => (
					<div key={i} className={color}>
						<input
							type="checkbox"
							name="color-options"
							id={'color-options-' + color}
							value={color}
							onChange={colorsChanged}
							checked={selected.Colors.includes(color)}
							className="mr-1"
						/>
						<label htmlFor={'color-options-' + color}>{color}</label>
					</div>
				))}
			</div>
			<div id="column-select-div">
				<select
					name="column-select"
					defaultValue={selected.Columns}
					onChange={columnsChanged}
				>
					{columns.map((c, i) => (
						<option key={i} value={c}>
							{c}
						</option>
					))}
				</select>
			</div>
			<div id="new-game-div">
				<button onClick={newGameClicked} disabled={selected.Colors.length < 2}>
					New Game
				</button>
			</div>
		</div>
	)
}
