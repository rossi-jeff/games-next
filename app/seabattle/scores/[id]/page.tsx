import { apiUrl } from '../../../../lib/api-url'
import { SeaBattle } from '../../../../types/sea-battle.type'
import { Navy } from '../../../../enum/navy.enum'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'
import SeaBattlePlayerTurnDisplay from './sea-battle-player-turn-display'
import SeaBattleOpponentTurnDisplay from './sea-battle-opponent-turn-display'

export async function generateStaticParams() {
	const results = await fetch(`${apiUrl}/api/sea_battle?Limit=100`)

	if (!results.ok) return []

	const { Items }: { Items: SeaBattle[] } = await results.json()

	return Items.map((item) => ({ id: item.id }))
}

async function getSeabattle(id: string) {
	const result = await fetch(`${apiUrl}/api/sea_battle/${id}`)

	if (!result.ok) return {}

	const seaBattle: SeaBattle = await result.json()
	return seaBattle
}

export default async function SeaBattleScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const seaBattle: SeaBattle = await getSeabattle(params.id)
	return (
		<div id="sea-battle-detail" className="m-2">
			<h1>Sea Battle Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				<SeaBattlePlayerTurnDisplay
					axis={seaBattle.Axis || 8}
					turns={
						seaBattle && seaBattle.turns && seaBattle.turns.length > 0
							? seaBattle.turns.filter((t) => t.Navy == Navy.Player)
							: []
					}
					ships={
						seaBattle && seaBattle.ships && seaBattle.ships.length > 0
							? seaBattle.ships.filter((s) => s.Navy == Navy.Opponent)
							: []
					}
				/>
				<SeaBattleOpponentTurnDisplay
					axis={seaBattle.Axis || 8}
					turns={
						seaBattle && seaBattle.turns && seaBattle.turns.length > 0
							? seaBattle.turns.filter((t) => t.Navy == Navy.Opponent)
							: []
					}
					ships={
						seaBattle && seaBattle.ships && seaBattle.ships.length > 0
							? seaBattle.ships.filter((s) => s.Navy == Navy.Player)
							: []
					}
				/>
			</Suspense>
			<Link href="/seabattle/scores">Back To Scores</Link>
		</div>
	)
}
