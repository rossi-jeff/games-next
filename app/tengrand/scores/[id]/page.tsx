'use client'

import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { TenGrand } from '../../../../types/ten-grand.type'
import TenGrandScoreCard from '../../ten-grand-score-card'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'
import { useParams } from 'next/navigation'
import LoadingIndicator from '../../../../components/loading-indicator'

export const revalidate = 0

export default function TenGrandScoreDetail() {
	const params = useParams()
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/ten_grand/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <LoadingIndicator />

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
