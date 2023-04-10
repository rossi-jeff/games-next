import { FreeCell } from '../../../types/free-cell.type'

export default function FreeCellScoreRow({
	free_cell,
}: {
	free_cell: FreeCell
}) {
	return (
		<div className="flex flex-wrap px-2 justify-between">
			<div>{free_cell.user ? free_cell.user.UserName : 'Anonymous'}</div>
			<div>{free_cell.Status}</div>
			<div>{free_cell.Elapsed}</div>
			<div>{free_cell.Moves}</div>
		</div>
	)
}
