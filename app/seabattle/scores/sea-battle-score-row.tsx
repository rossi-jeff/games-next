import { SeaBattle } from '../../../types/sea-battle.type'

export default function SeaBattleScoreRow({
	sea_battle,
}: {
	sea_battle: SeaBattle
}) {
	return (
		<div className="flex flex-wrap px-2 justify-between">
			<div>{sea_battle.id}</div>
			<div>{sea_battle.user ? sea_battle.user.UserName : 'Anonymous'}</div>
			<div>{sea_battle.Status}</div>
			<div>{sea_battle.Score}</div>
			<div>{sea_battle.Axis}</div>
		</div>
	)
}
