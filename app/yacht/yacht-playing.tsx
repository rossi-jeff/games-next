'use client'

import { useState } from 'react'
import { Yacht } from '../../types/yacht.type'
import { YachtTurn } from '../../types/yacht-turn.type'
import YachtRollDisplay from './yacht-roll-display'
import { YachtScoreOption } from '../../types/yacht-score-option.type'

export default function YachtPlaying({
	yacht,
	reloadGame,
}: {
	yacht: Yacht
	reloadGame: Function
}) {
	const [turn, setTurn] = useState<YachtTurn>({})
	const [flagOne, setFlagOne] = useState<boolean>(false)
	const [flagTwo, setFlagTwo] = useState<boolean>(false)
	const [options, setOptions] = useState<YachtScoreOption[]>([])

	const clickReload = () => {
		reloadGame()
	}

	const firstRoll = async () => {}

	const secondRoll = async () => {}

	const thirdRoll = async () => {}
	return (
		<div className="yacht-playing">
			<div>Playing {yacht.id}</div>
			{turn && turn.RollOne != undefined && turn.RollOne != '' ? (
				<YachtRollDisplay
					roll={turn.RollOne}
					heading="First Roll"
					label="Second Roll"
					rollDice={secondRoll}
					flag={flagOne}
				/>
			) : (
				<div>
					<button onClick={firstRoll}>First Roll</button>
				</div>
			)}
			{turn.RollTwo != undefined && turn.RollTwo != '' && (
				<YachtRollDisplay
					roll={turn.RollTwo}
					heading="Second Roll"
					label="Third Roll"
					rollDice={thirdRoll}
					flag={flagTwo}
				/>
			)}
			{turn.RollThree != undefined && turn.RollThree != '' && (
				<YachtRollDisplay
					roll={turn.RollThree}
					heading="Third Roll"
					label=""
					rollDice={thirdRoll}
					flag={true}
				/>
			)}
			<button onClick={() => clickReload()}>Reload</button>
		</div>
	)
}
