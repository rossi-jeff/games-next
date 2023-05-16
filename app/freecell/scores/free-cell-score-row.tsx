import { formatElapsed } from '../../../lib/clock.class'
import { FreeCell } from '../../../types/free-cell.type'

export default function FreeCellScoreRow({
	free_cell,
}: {
	free_cell: FreeCell
}) {
	return (
		<div className="score-row">
			<div className="cell-left">
				{free_cell.user ? free_cell.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{free_cell.Status}</div>
			<div className="cell-center">{formatElapsed(free_cell.Elapsed || 0)}</div>
			<div className="cell-right">{free_cell.Moves}</div>
		</div>
	)
}
