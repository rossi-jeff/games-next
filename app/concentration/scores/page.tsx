'use client'

import { useRouter } from 'next/navigation'
import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import { Concentration } from '../../../types/concentration.type'
import ConcentrationScoreRow from './concentration-score-row'

export default function ConcentrationScores({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const path = '/api/concentration'
	const { limit, offset } = searchParams
	const url = buildPaginatedUrl(path, limit, offset)
	const { data, error, isLoading } = useSWR(url.href, fetcher)
	const router = useRouter()

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

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
			<div>
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
		</div>
	)
}
