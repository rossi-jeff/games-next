'use client'

import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import YachtScoreRow from './yacht-score-row'
import { useRouter, useSearchParams } from 'next/navigation'
import { Yacht } from '../../../types/yacht.type'
import { Suspense } from 'react'
import PaginatedPlaceHolder from '../../../components/paginated-place-holder'

export default function YachtScores() {
	const path = '/api/yacht'
	const searchParams = useSearchParams()
	const limit = searchParams.get('limit')
	const offset = searchParams.get('offset')
	const url = buildPaginatedUrl(path, limit, offset)
	const { data, error, isLoading } = useSWR(url.href, fetcher)
	const router = useRouter()

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const { Items, Count, Limit, Offset } = data

	const pageChanged = (page: number) => {
		const offset = (page - 1) * Limit
		router.push(`/yacht/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/yacht/scores?limit=${limit}&offset=0`)
	}

	return (
		<div id="yacht-scores" className="m-2">
			<h1>Yacht Scores</h1>
			<div className="score-header">
				<div className="cell-left"></div>
				<div className="cell-center">User</div>
				<div className="cell-right">Score</div>
			</div>
			<Suspense fallback={<PaginatedPlaceHolder />}>
				{Items.map((yacht: Yacht) => (
					<YachtScoreRow key={yacht.id} yacht={yacht} />
				))}
			</Suspense>
			<PaginationControl
				count={Count}
				limit={Limit}
				offset={Offset}
				pageChanged={(page: number) => pageChanged(page)}
				limitChanged={(limit: number) => limitChanged(limit)}
			/>
		</div>
	)
}
