import { Concentration } from '../../../types/concentration.type'

export default function ConcentrationScoreRow({
	concentration,
}: {
	concentration: Concentration
}) {
	return (
		<div className="flex flex-wrap px-2 justify-between">
			<div>
				{concentration.user ? concentration.user.UserName : 'Anonymous'}
			</div>
			<div>{concentration.Status}</div>
			<div>{concentration.Elapsed}</div>
			<div>{concentration.Moves}</div>
			<div>{concentration.Matched}</div>
		</div>
	)
}
