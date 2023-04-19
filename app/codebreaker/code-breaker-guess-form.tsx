import { useEffect, useState } from 'react'

export default function CodeBreakerGuessForm({
	columns,
	available,
	sendGuess,
}: {
	columns: number
	available: string[]
	sendGuess: Function
}) {
	const [selected, setSelected] = useState<string[]>([])

	const colorChanged = (ev: any, idx: number) => {
		const current: string[] = [...selected]
		const color: string = available[ev.target.selectedIndex - 1]
		current[idx] = color
		if (ev.target) {
			for (const c of available) ev.target.classList.remove(c)
			ev.target.classList.add(color)
		}
		setSelected(current)
	}

	const sendGuessClicked = () => {
		let valid: boolean = true
		for (const color of selected) {
			if (color == '' || color == undefined) valid = false
		}
		if (valid) {
			sendGuess({ selected })
			const s: string[] = []
			const selects = document.getElementsByClassName('color-select')
			for (let i = 0; i < columns; i++) {
				s[i] = ''
				const el = selects[i] as HTMLSelectElement
				if (el) {
					el.selectedIndex = 0
					for (const c of available) el.classList.remove(c)
				}
			}
			setSelected(s)
		}
	}

	useEffect(() => {
		const s: string[] = []
		const selects = document.getElementsByClassName('color-select')
		for (let i = 0; i < columns; i++) {
			s[i] = ''
			const el = selects[i] as HTMLSelectElement
			if (el) {
				el.selectedIndex = 0
				for (const c of available) el.classList.remove(c)
			}
		}
		setSelected(s)
	}, [columns, available])

	return (
		<div className="rounded-box  flex flex-wrap justify-between">
			{[...Array(columns)].map((e, i) => (
				<div key={i}>
					<select
						name="color-select"
						className="color-select"
						id={'color-select-' + i}
						onChange={(ev) => colorChanged(ev, i)}
						defaultValue={selected[i]}
					>
						<option value="">-- select --</option>
						{available.map((color, idx) => (
							<option key={idx} value={color} className={color}>
								{color}
							</option>
						))}
					</select>
				</div>
			))}
			<div>
				<button onClick={sendGuessClicked}>Send Guess</button>
			</div>
		</div>
	)
}
