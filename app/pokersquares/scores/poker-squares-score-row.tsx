import { PokerSquare } from '../../../types/poker-square.type'

export default function PokerSquaresScoreRow({
	pokerSquare,
}: {
	pokerSquare: PokerSquare
}) {
	return (
		<div className="score-row">
			<div className="cell-left">
				{pokerSquare.user ? pokerSquare.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{pokerSquare.Status}</div>
			<div className="cell-right">{pokerSquare.Score}</div>
		</div>
	)
}
