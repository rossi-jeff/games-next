'use client'

import { Suspense } from 'react'
import PaginatedPlaceHolder from '../../../components/paginated-place-holder'
import { useRouter, useSearchParams } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import LoadingIndicator from '../../../components/loading-indicator'
import { Spider } from '../../../types/spider.type'
import SpiderScoreRow from './SpiderScoreRow'

export default function SpiderScores() {
	const path = '/api/spider'
	const params = useSearchParams()
	const limit = params.get('limit') || undefined
	const offset = params.get('offset') || undefined
	const url = buildPaginatedUrl(path, limit, offset)
	const { data, error, isLoading } = useSWR(url.href, fetcher)
	const router = useRouter()

	if (error) return <div>{error}</div>
	if (isLoading) return <LoadingIndicator />

	const { Items, Count, Limit, Offset } = data

	const pageChanged = (page: number) => {
		const offset = (page - 1) * Limit
		router.push(`/spider/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/spider/scores?limit=${limit}&offset=0`)
	}
	return (
		<div id="spider-scores" className="m-2">
			<h1>Spider Scores</h1>
			<Suspense fallback={<PaginatedPlaceHolder />}>
				<div>
					<div className="score-header">
						<div className="cell-left">User</div>
						<div className="cell-center">Status</div>
						<div className="cell-center">Suits</div>
						<div className="cell-center">Time</div>
						<div className="cell-right">Moves</div>
					</div>

					{Items.map((spider: Spider) => (
						<SpiderScoreRow key={spider.id} spider={spider} />
					))}
				</div>
				<PaginationControl
					count={Count}
					limit={Limit}
					offset={Offset}
					pageChanged={(page: number) => pageChanged(page)}
					limitChanged={(limit: number) => limitChanged(limit)}
				/>
			</Suspense>
		</div>
	)
}
