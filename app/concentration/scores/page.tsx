'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import { Concentration } from '../../../types/concentration.type'
import ConcentrationScoreRow from './concentration-score-row'
import { Suspense } from 'react'
import PaginatedPlaceHolder from '../../../components/paginated-place-holder'
import LoadingIndicator from '../../../components/loading-indicator'

export default function ConcentrationScores() {
	const path = '/api/concentration'
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
		router.push(`/concentration/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/concentration/scores?limit=${limit}&offset=0`)
	}

	return (
		<div id="concentration-scores" className="m-2">
			<h1>Concentration Scores</h1>
			<Suspense fallback={<PaginatedPlaceHolder />}>
				<div>
					<div className="score-header">
						<div className="cell-left">User</div>
						<div className="cell-center">Status</div>
						<div className="cell-center">Time</div>
						<div className="cell-center">Moves</div>
						<div className="cell-right">Matches</div>
					</div>

					{Items.map((concentration: Concentration) => (
						<ConcentrationScoreRow
							key={concentration.id}
							concentration={concentration}
						/>
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
