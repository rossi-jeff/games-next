import { TenGrandTurn } from '../../types/ten-grand-turn.type'
import TenGrandTurnDisplay from './ten-grand-turn-display'

export default function TenGrandScoreCard({
	turns,
}: {
	turns: TenGrandTurn[]
}) {
	return (
		<div className="rounded-box max-h-96 overflow-y-auto">
			{turns.length > 0 &&
				turns.map((turn) => <TenGrandTurnDisplay key={turn.id} turn={turn} />)}
		</div>
	)
}
