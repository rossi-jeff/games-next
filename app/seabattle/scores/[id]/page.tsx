'use client'

import { useParams } from 'next/navigation'
import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { SeaBattle } from '../../../../types/sea-battle.type'
import { Navy } from '../../../../enum/navy.enum'
import SeaBattlePlayerTurn from '../../sea-battle-player-turn'
import SeaBattleOpponentTurn from '../../sea-battle-opponent-turn'
import Link from 'next/link'
import { buildPaginatedUrl } from '../../../../lib/get-paginated-scores'
import { IdArray } from '../../../../types/id-array.type'

export async function generateStaticParams(): Promise<IdArray> {
	const url = buildPaginatedUrl('/api/sea_battle', '100', '0')
	const result = await fetch(url.href)
	const data: { Items: SeaBattle[] } = await result.json()
	return data.Items.map((record: SeaBattle) => ({
		id: record.id ? record.id.toString() : '0',
	}))
}

export const dynamicParams = true

export default function SeaBattleScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/sea_battle/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const seaBattle: SeaBattle = data
	return (
		<div id="sea-battle-detail" className="m-2">
			<h1>Sea Battle Score</h1>
			<SeaBattlePlayerTurn
				axis={seaBattle.Axis || 8}
				hasFired={true}
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
				fire={() => {}}
				toggle={() => {}}
			/>
			<SeaBattleOpponentTurn
				axis={seaBattle.Axis || 8}
				hasFired={true}
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
				fire={() => {}}
				toggle={() => {}}
			/>
			<Link href="/seabattle/scores">Back To Scores</Link>
		</div>
	)
}
