'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import { HangMan } from '../../../types/hang-man.type'
import HangManScoreRow from './hang-man-score-row'
import { Suspense } from 'react'
import PaginatedPlaceHolder from '../../../components/paginated-place-holder'
import LoadingIndicator from '../../../components/loading-indicator'

export default function HangManScores() {
	const path = '/api/hang_man'
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
		router.push(`/hangman/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/hangman/scores?limit=${limit}&offset=0`)
	}

	return (
		<div id="hang-man-scores" className="m-2">
			<h1>Hang Man Scores</h1>
			<Suspense fallback={<PaginatedPlaceHolder />}>
				<div>
					<div className="score-header">
						<div className="cell-left"></div>
						<div className="cell-center">User</div>
						<div className="cell-center">Status</div>
						<div className="cell-center">Score</div>
						<div className="cell-center">Correct</div>
						<div className="cell-center">Wrong</div>
						<div className="cell-right">Word</div>
					</div>

					{Items.map((hang_man: HangMan) => (
						<HangManScoreRow key={hang_man.id} hang_man={hang_man} />
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
