'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import GuessWordScoreRow from './guess-word-score-row'
import { GuessWord } from '../../../types/guess-word.type'
import { Suspense } from 'react'
import PaginatedPlaceHolder from '../../../components/paginated-place-holder'

export default function GuessWordScores() {
	const path = '/api/guess_word'
	const params = useSearchParams()
	const limit = params.get('limit') || undefined
	const offset = params.get('offset') || undefined
	const url = buildPaginatedUrl(path, limit, offset)
	const { data, error, isLoading } = useSWR(url.href, fetcher)
	const router = useRouter()

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const { Items, Count, Limit, Offset } = data

	const pageChanged = (page: number) => {
		const offset = (page - 1) * Limit
		router.push(`/guessword/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/guessword/scores?limit=${limit}&offset=0`)
	}

	return (
		<div id="guess-word-scores" className="m-2">
			<h1>Guess Word Scores</h1>
			<div>
				<div className="score-header">
					<div className="cell-left"></div>
					<div className="cell-center">User</div>
					<div className="cell-center">Status</div>
					<div className="cell-center">Score</div>
					<div className="cell-center">Word</div>
					<div className="cell-right">Length</div>
				</div>
				<Suspense fallback={<PaginatedPlaceHolder />}>
					{Items.map((guess_word: GuessWord) => (
						<GuessWordScoreRow key={guess_word.id} guess_word={guess_word} />
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
