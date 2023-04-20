'use client'

import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { Yacht } from '../../../../types/yacht.type'
import YachtScoreCard from '../../yacht-score-card'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'
import { useParams } from 'next/navigation'

export const dynamicParams = true

export default function YachtScoreDetail() {
	const params = useParams()
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/yacht/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const yacht: Yacht = data

	return (
		<div id="yacht-detail" className="m-2">
			<h1>Yacht Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				<YachtScoreCard
					total={yacht.Total || 0}
					turns={yacht.turns && yacht.turns.length > 0 ? yacht.turns : []}
				/>
			</Suspense>
			<Link href="/yacht/scores">Back To Scores</Link>
		</div>
	)
}
