'use client'

import { useParams } from 'next/navigation'
import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { Yacht } from '../../../../types/yacht.type'
import YachtScoreCard from '../../yacht-score-card'
import Link from 'next/link'
import { buildPaginatedUrl } from '../../../../lib/get-paginated-scores'
import { IdArray } from '../../../../types/id-array.type'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'

export async function generateStaticParams(): Promise<IdArray> {
	const url = buildPaginatedUrl('/api/yacht', '100', '0')
	const result = await fetch(url.href)
	const data: { Items: Yacht[] } = await result.json()
	return data.Items.map((record: Yacht) => ({
		id: record.id ? record.id.toString() : '0',
	}))
}

export const dynamicParams = true

export default function YachtScoreDetail({
	params,
}: {
	params: { id: string }
}) {
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
