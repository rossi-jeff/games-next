'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import { Klondike } from '../../../types/klondike.type'
import KlondikeScoreRow from './klondike-score-row'
import { Suspense } from 'react'
import PaginatedPlaceHolder from '../../../components/paginated-place-holder'

export default function KlondikeScores() {
	const path = '/api/klondike'
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
		router.push(`/klondike/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/klondike/scores?limit=${limit}&offset=0`)
	}

	return (
		<div id="klondike-scores" className="m-2">
			<h1>Klondike Scores</h1>
			<div>
				<div className="score-header">
					<div className="cell-left">User</div>
					<div className="cell-center">Status</div>
					<div className="cell-center">Time</div>
					<div className="cell-right">Moves</div>
				</div>
				<Suspense fallback={<PaginatedPlaceHolder />}>
					{Items.map((klondike: Klondike) => (
						<KlondikeScoreRow key={klondike.id} klondike={klondike} />
					))}
				</Suspense>
			</div>
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
