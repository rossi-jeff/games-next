import { Concentration } from '../../../types/concentration.type'

export default function ConcentrationScoreRow({
	concentration,
}: {
	concentration: Concentration
}) {
	return (
		<div className="score-row">
			<div className="cell-left">
				{concentration.user ? concentration.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{concentration.Status}</div>
			<div className="cell-center">{concentration.Elapsed}</div>
			<div className="cell-center">{concentration.Moves}</div>
			<div className="cell-right">{concentration.Matched}</div>
		</div>
	)
}
