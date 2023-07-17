'use client'

import { Suspense } from 'react'
import PaginatedPlaceHolder from '../../../components/paginated-place-holder'
import { useRouter, useSearchParams } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import LoadingIndicator from '../../../components/loading-indicator'
import PaginationControl from '../../../components/pagination-control'
import { PokerSquare } from '../../../types/poker-square.type'
import PokerSquaresScoreRow from './poker-squares-score-row'

export default function PokerSquaresScores() {
	const path = '/api/poker_square'
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
		router.push(`/pokersquares/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/pokersquares/scores?limit=${limit}&offset=0`)
	}

	return (
		<div id="poker-squares-scores" className="m-2">
			<h1>Poker Squares Scores</h1>
			<Suspense fallback={<PaginatedPlaceHolder />}>
				<div>
					<div className="score-header">
						<div className="cell-left">User</div>
						<div className="cell-center">Status</div>
						<div className="cell-right">Score</div>
					</div>
					{Items.map((pokerSquare: PokerSquare) => (
						<PokerSquaresScoreRow
							key={pokerSquare.id}
							pokerSquare={pokerSquare}
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
