import { Klondike } from '../../../types/klondike.type'

export default function KlondikeScoreRow({ klondike }: { klondike: Klondike }) {
	return (
		<div className="flex flex-wrap px-2 justify-between">
			<div>{klondike.user ? klondike.user.UserName : 'Anonymous'}</div>
			<div>{klondike.Status}</div>
			<div>{klondike.Elapsed}</div>
			<div>{klondike.Moves}</div>
		</div>
	)
}
