import { TenGrand } from '../../../types/ten-grand.type'

export default function TenGrandScoreRow({
	ten_grand,
}: {
	ten_grand: TenGrand
}) {
	return (
		<div className="score-row">
			<div className="cell-left">{ten_grand.id}</div>
			<div className="cell-center">
				{ten_grand.user ? ten_grand.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{ten_grand.Status}</div>
			<div className="cell-right">{ten_grand.Score}</div>
		</div>
	)
}
