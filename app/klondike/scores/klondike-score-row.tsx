import { Klondike } from '../../../types/klondike.type'

export default function KlondikeScoreRow({ klondike }: { klondike: Klondike }) {
	return (
		<div className="score-row">
			<div className="cell-left">
				{klondike.user ? klondike.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{klondike.Status}</div>
			<div className="cell-center">{klondike.Elapsed}</div>
			<div className="cell-right">{klondike.Moves}</div>
		</div>
	)
}
