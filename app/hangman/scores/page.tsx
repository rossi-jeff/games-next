'use client'

import { useRouter } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import { HangMan } from '../../../types/hang-man.type'
import HangManScoreRow from './hang-man-score-row'

export default function HangManScores({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const path = '/api/hang_man'
	const { limit, offset } = searchParams
	const url = buildPaginatedUrl(path, limit, offset)
	const { data, error, isLoading } = useSWR(url.href, fetcher)
	const router = useRouter()

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const { Items, Count, Limit, Offset } = data

	const pageChanged = (page: number) => {
		const offset = (page - 1) * Limit
		router.push(`/hangman/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/hangman/scores?limit=${limit}&offset=0`)
	}

	return (
		<div id="hang-man-scores" className='m-2'>
			<h1>Hang man Scores</h1>
			<div>
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
		</div>
	)
}
