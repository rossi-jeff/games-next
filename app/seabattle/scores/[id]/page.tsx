'use client'

import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { SeaBattle } from '../../../../types/sea-battle.type'
import { Navy } from '../../../../enum/navy.enum'
import SeaBattlePlayerTurn from '../../sea-battle-player-turn'
import SeaBattleOpponentTurn from '../../sea-battle-opponent-turn'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'
import { useParams } from 'next/navigation'

export const dynamicParams = true

export default function SeaBattleScoreDetail() {
	const params = useParams()
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
			<Suspense fallback={<DetailPlaceHolder />}>
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
			</Suspense>
			<Link href="/seabattle/scores">Back To Scores</Link>
		</div>
	)
}
