import { SeaBattle } from '../../../types/sea-battle.type'

export default function SeaBattleScoreRow({
	sea_battle,
}: {
	sea_battle: SeaBattle
}) {
	return (
		<div className="score-row">
			<div className="cell-left">{sea_battle.id}</div>
			<div className="cell-center">
				{sea_battle.user ? sea_battle.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{sea_battle.Status}</div>
			<div className="cell-center">{sea_battle.Score}</div>
			<div className="cell-right">{sea_battle.Axis}</div>
		</div>
	)
}
