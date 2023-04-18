'use client'

import { useRouter } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import { Klondike } from '../../../types/klondike.type'
import KlondikeScoreRow from './klondike-score-row'

export default function KlondikeScores({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const path = '/api/klondike'
	const { limit, offset } = searchParams
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
				{Items.map((klondike: Klondike) => (
					<KlondikeScoreRow key={klondike.id} klondike={klondike} />
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
