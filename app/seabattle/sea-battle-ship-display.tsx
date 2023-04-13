import { SeaBattleShip } from '@/types/sea-batte-ship.type'
import { SeaBattleShipGridPoint } from '../../types/sea-battle-ship-grid-point.type'

export default function SeaBattleShipDisplay({
	ship,
}: {
	ship: SeaBattleShip
}) {
	const pointCssClass = (point: SeaBattleShipGridPoint) => {
		let className = 'grid-cell occupied'
		if (ship.hits) {
			for (const hit of ship.hits) {
				if (
					hit.Horizontal == point.Horizontal &&
					hit.Vertical == point.Vertical
				)
					className += ' Hit'
			}
		}
		return className
	}

	return (
		<div className="sea-battle-ship-display">
			<div className="ship-icon">
				{ship.points &&
					ship.points.map((point) => (
						<div key={point.id} className={pointCssClass(point)}>
							<span></span>
						</div>
					))}
			</div>
			<div className="font-bold text-center">{ship.Type}</div>
		</div>
	)
}
