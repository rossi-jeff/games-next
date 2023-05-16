import { SeaBattleMaxAxis } from '../../../../lib/sea-battle-max-axis'
import { SeaBattleShip } from '../../../../types/sea-batte-ship.type'
import { SeaBattleTurn } from '../../../../types/sea-battle-turn.type'

export default function SeaBattleOpponentTurnDisplay({
	axis,
	ships,
	turns,
}: {
	axis: number
	ships: SeaBattleShip[]
	turns: SeaBattleTurn[]
}) {
	const horizontal = SeaBattleMaxAxis.H.slice(0, axis)
	const vertical = SeaBattleMaxAxis.V.slice(0, axis)

	const getClassName = (H: string, V: number) => {
		let className = 'grid-cell'
		let found = false
		for (const ship of ships) {
			if (ship.points) {
				for (const point of ship.points) {
					if (point.Horizontal == H && point.Vertical == V) {
						className += ' occupied'
						found = true
						break
					}
				}
			}
			if (found) break
		}
		for (const turn of turns) {
			if (turn.Horizontal == H && turn.Vertical == V) {
				className += ` ${turn.Target}`
				break
			}
		}
		return className
	}

	return (
		<div className="rounded-box">
			<h1 className="ml-2">Opponent Turn</h1>
			<div className="sea-battle-opponent-grid">
				<div className="grid-row">
					<div className="grid-header-cell"></div>
					{horizontal.map((H) => (
						<div key={'og-th-' + H} className="grid-header-cell">
							{H}
						</div>
					))}
				</div>
				{vertical.map((V) => (
					<div key={'og-r-' + V} className="grid-row">
						<div className="grid-header-cell">{V}</div>
						{horizontal.map((H) => (
							<div
								key={'ot-c-' + V + '-' + H}
								className={getClassName(H, V)}
								id={'OT-' + V + '-' + H}
							>
								<span></span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	)
}
