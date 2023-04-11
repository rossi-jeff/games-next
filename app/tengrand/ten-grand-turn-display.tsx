import SmallDiceRow from '../../components/small-dice-row'
import { TenGrandTurn } from '../../types/ten-grand-turn.type'

export default function TenGrandTurnDisplay({ turn }: { turn: TenGrandTurn }) {
	return (
		<div className="flex flex-wrap border-b border-dashed border-slate-500 mb-1">
			<div className="flex-grow mb-1">
				{turn.scores &&
					turn.scores.length > 0 &&
					turn.scores.map((score) => (
						<div key={score.id} className="score-row px-2">
							<div>{score.Category}</div>
							<div className="w-42 py-1">
								{score.Dice != undefined && score.Dice != '' && (
									<SmallDiceRow roll={score.Dice} />
								)}
							</div>
							<div className="cell-right">{score.Score}</div>
						</div>
					))}
			</div>
			<div className="w-32 text-center">{turn.Score}</div>
		</div>
	)
}
