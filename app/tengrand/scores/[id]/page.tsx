'use client'

import { useParams } from 'next/navigation'
import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { TenGrand } from '../../../../types/ten-grand.type'
import TenGrandScoreCard from '../../ten-grand-score-card'
import Link from 'next/link'
import { buildPaginatedUrl } from '../../../../lib/get-paginated-scores'
import { IdArray } from '../../../../types/id-array.type'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'

export async function generateStaticParams(): Promise<IdArray> {
	const url = buildPaginatedUrl('/api/ten_grand', '100', '0')
	const result = await fetch(url.href)
	const data: { Items: TenGrand[] } = await result.json()
	return data.Items.map((record: TenGrand) => ({
		id: record.id ? record.id.toString() : '0',
	}))
}

export const dynamicParams = true

export default function TenGrandScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/ten_grand/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const tenGrand: TenGrand = data

	return (
		<div id="ten-grand-detail" className="m-2">
			<h1>Ten Grand Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				<TenGrandScoreCard
					turns={
						tenGrand.turns && tenGrand.turns.length > 0 ? tenGrand.turns : []
					}
				/>
			</Suspense>
			<Link href="/tengrand/scores">Back To Scores</Link>
		</div>
	)
}
