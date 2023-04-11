import { YachtTurn } from '../../types/yacht-turn.type'
import React from 'react'
import SmallDiceRow from '../../components/small-dice-row'

export default function YachtScoreCard({
	total,
	turns,
}: {
	total: number
	turns: YachtTurn[]
}) {
	return (
		<div className="border border-black rounded p-2 mb-2">
			{turns.map((turn) => (
				<div key={turn.id} className="score-row py-1">
					<div className="cell-left">{turn.Category}</div>
					<div className="cell-center-wide">
						{turn.RollOne != undefined && <SmallDiceRow roll={turn.RollOne} />}
					</div>
					<div className="cell-center-wide">
						{turn.RollTwo != undefined && <SmallDiceRow roll={turn.RollTwo} />}
					</div>
					<div className="cell-center-wide">
						{turn.RollThree != undefined && (
							<SmallDiceRow roll={turn.RollThree} />
						)}
					</div>
					<div className="cell-right">{turn.Score}</div>
				</div>
			))}
			<div className="flex flex-wrap mx-2">
				<div className="flex-grow text-right mr-2 font-bold">Total</div>
				<div>{total}</div>
			</div>
		</div>
	)
}
