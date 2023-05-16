import { SeaBattleMaxAxis } from '../../../../lib/sea-battle-max-axis'
import { SeaBattleShip } from '../../../../types/sea-batte-ship.type'
import { SeaBattleTurn } from '../../../../types/sea-battle-turn.type'
import SeaBattleShipDisplay from '../../sea-battle-ship-display'

export default function SeaBattlePlayerTurnDisplay({
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
			<h1 className="ml-2">Player Turn</h1>
			<div className="sea-battle-player-grid">
				<div className="grid-row">
					<div className="grid-header-cell"></div>
					{horizontal.map((H) => (
						<div key={'pg-th-' + H} className="grid-header-cell">
							{H}
						</div>
					))}
				</div>
				{vertical.map((V) => (
					<div key={'pg-r-' + V} className="grid-row">
						<div className="grid-header-cell">{V}</div>
						{horizontal.map((H) => (
							<div
								key={'pt-c-' + V + '-' + H}
								className={getClassName(H, V)}
								id={'PT-' + V + '-' + H}
							>
								<span></span>
							</div>
						))}
					</div>
				))}
			</div>
			<div className="flex flex-wrap p-2">
				{ships.map((ship) => (
					<SeaBattleShipDisplay key={ship.id} ship={ship} />
				))}
			</div>
		</div>
	)
}
