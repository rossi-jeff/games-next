import { useState } from 'react'
import { TenGrandOption } from '../../types/ten-grand-option.type'

export default function TenGrandScoreOptions({
	options,
	scoreOptions,
}: {
	options: TenGrandOption[]
	scoreOptions: Function
}) {
	const [checked, setChecked] = useState<number[]>([])

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

	const scoreClicked = () => {
		const selected: TenGrandOption[] = []
		for (const idx of checked) selected.push(options[idx])
		if (!selected.length) return
		scoreOptions({ selected })
	}
	return (
		<div className="rounded-box">
			{options.map((option, index) => (
				<div key={index} className="score-row">
					<div className="mr-2">
						<input
							type="checkbox"
							name="selected-options"
							value={index}
							onChange={cbChanged}
						/>
					</div>
					<div className="flex-grow">{option.Category}</div>
					<div>{option.Score}</div>
				</div>
			))}
			<div>
				<button onClick={scoreClicked}>Score Options</button>
			</div>
		</div>
	)
}
