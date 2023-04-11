import { useEffect, useState } from 'react'
import { TenGrand } from '../../types/ten-grand.type'
import { TenGrandTurn } from '../../types/ten-grand-turn.type'
import { TenGrandOption } from '../../types/ten-grand-option.type'
import { apiUrl } from '../../lib/api-url'
import { buildRequestHeaders } from '../../lib/build-request-headers'
import TenGrandScoreOptions from './ten-grand-score-options'
import DieLarge from '../../components/die-large'
import { TenGrandCategory } from '../../enum/ten-grand-category.enum'
import TenGrandTurnDisplay from './ten-grand-turn-display'

export default function TenGrandPlaying({
	tenGrand,
	reloadGame,
}: {
	tenGrand: TenGrand
	reloadGame: Function
}) {
	const [turn, setTurn] = useState<TenGrandTurn>({})
	const [options, setOptions] = useState<TenGrandOption[]>([])
	const [rollDice, setRollDice] = useState<number[]>([])
	const [scoreDice, setScoreDice] = useState<number[]>([])

	const roll = async () => {
		if (!tenGrand.id) return
		const Quantity = rollDice.length || 6
		try {
			const result = await fetch(
				`${apiUrl}/api/ten_grand/${tenGrand.id}/roll`,
				{
					method: 'POST',
					body: JSON.stringify({ Quantity }),
					headers: buildRequestHeaders(),
				}
			)
			if (result.ok) {
				const dice = await result.json()
				setRollDice(dice)
				getOptions()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const getOptions = async () => {
		const Dice = [...scoreDice]
		try {
			const result = await fetch(`${apiUrl}/api/ten_grand/options`, {
				method: 'POST',
				body: JSON.stringify({ Dice }),
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const { Options } = await result.json()
				setOptions(Options)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const dragStart = (event: any) => {
		if (event.target) event.dataTransfer.setData('text', event.target.id)
		else if (event.detail)
			event.detail.dataTransfer.setData('text', event.detail.target.id)
	}

	const dragOver = (event: any) => {
		event.preventDefault()
	}

	const dragEnter = (event: any) => {
		let { target } = event
		if (target) {
			while (target && !target.classList.contains('dice-container-box')) {
				target = target.parentElement
			}
			target.classList.add('over')
			setTimeout(() => target.classList.remove('over'), 500)
		}
	}

	const drop = (event: any) => {
		event.preventDefault()
		event.stopPropagation()
		const data = event.dataTransfer.getData('text')
		let [face, idx, from] = data.split('_')
		idx = parseInt(idx)
		face = parseInt(face)
		let { target } = event
		let id: string = ''
		if (target) {
			while (target && !target.classList.contains('dice-container-box')) {
				target = target.parentElement
			}
			id = target.id
		}
		let fromDice: number[] = []
		let toDice: number[] = []
		if (id == 'score-dice') {
			if (from == 'score') return
			fromDice = [...rollDice]
			fromDice.splice(idx, 1)
			toDice = [...scoreDice]
			toDice.push(face)
			setRollDice(fromDice)
			setScoreDice(toDice)
		} else if (id == 'roll-dice') {
			if (from == 'roll') return
			fromDice = [...scoreDice]
			fromDice.splice(idx, 1)
			toDice = [...rollDice]
			toDice.push(face)
			setScoreDice(fromDice)
			setRollDice(toDice)
		}
	}

	const scoreOptions = async (ev: any) => {
		const Options: TenGrandOption[] = ev.selected
		const TurnId = turn.id || 0
		let Dice = [...scoreDice]
		let crapOut: boolean = false
		for (const option of Options) {
			if (option.Category == TenGrandCategory.CrapOut) crapOut = true
		}
		if (crapOut) {
			Dice = [...scoreDice, ...rollDice]
			setRollDice([])
		}
		setScoreDice([])
		try {
			const result = await fetch(
				`${apiUrl}/api/ten_grand/${tenGrand.id}/score`,
				{
					method: 'POST',
					body: JSON.stringify({ TurnId, Dice, Options }),
					headers: buildRequestHeaders(),
				}
			)
			if (result.ok) {
				const Turn = await result.json()
				setTurn(Turn)
				setOptions([])
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		// get options on drag & drop
		const Dice = [...scoreDice]
		if (Dice.length) {
			fetch(`${apiUrl}/api/ten_grand/options`, {
				method: 'POST',
				body: JSON.stringify({ Dice }),
				headers: buildRequestHeaders(),
			})
				.then((res) => res.json())
				.then((data) => {
					const { Options } = data
					setOptions(Options)
				})
		}
	}, [scoreDice])

	useEffect(() => {
		if (scoreDice.length == 0 && rollDice.length == 0) {
			setTurn({})
			reloadGame()
		}
	}, [scoreDice, rollDice, reloadGame])

	return (
		<div className="rounded-box">
			<div className="score-row">
				<div>
					<strong className="mr-2">Turns</strong>
					{tenGrand.turns != undefined ? tenGrand.turns.length : 0}
				</div>
				<div>
					<strong className="mr-2">Status</strong>
					{tenGrand.Status}
				</div>
				<div>
					<strong className="mr-2">Score</strong>
					{tenGrand.Score}
				</div>
			</div>
			<div className="flex flex-wrap">
				<div
					id="roll-dice"
					className="dice-container-box mr-2"
					onDragOver={dragOver}
					onDragEnter={dragEnter}
					onDrop={drop}
				>
					{rollDice.map((face, index) => (
						<DieLarge
							key={index}
							face={face}
							index={index}
							heading="roll"
							draggable={true}
							dragStart={dragStart}
						/>
					))}
				</div>
				<div
					id="score-dice"
					className="dice-container-box"
					onDragOver={dragOver}
					onDragEnter={dragEnter}
					onDrop={drop}
				>
					{scoreDice.map((face, index) => (
						<DieLarge
							key={index}
							face={face}
							index={index}
							heading="score"
							draggable={true}
							dragStart={dragStart}
						/>
					))}
				</div>
			</div>
			{options && options.length > 0 ? (
				<TenGrandScoreOptions options={options} scoreOptions={scoreOptions} />
			) : (
				<div className="mb-2">
					<button onClick={roll}>Roll</button>
				</div>
			)}
			{turn && turn.id != undefined && (
				<div className="rounded-box">
					<TenGrandTurnDisplay turn={turn} />
				</div>
			)}
		</div>
	)
}
