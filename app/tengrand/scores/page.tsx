'use client'

import { buildPaginatedUrl } from '../../../lib/get-paginated-scores'
import { fetcher } from '../../../lib/fetcher'
import useSWR from 'swr'
import PaginationControl from '../../../components/pagination-control'
import { useRouter } from 'next/navigation'
import { TenGrand } from '../../../types/ten-grand.type'
import TenGrandScoreRow from './ten-grand-score-row'

export default function TenGrandScores({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const path = '/api/ten_grand'
	const { limit, offset } = searchParams
	const url = buildPaginatedUrl(path, limit, offset)
	const { data, error, isLoading } = useSWR(url.href, fetcher)
	const router = useRouter()

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const { Items, Count, Limit, Offset } = data

	const pageChanged = (page: number) => {
		const offset = (page - 1) * Limit
		router.push(`/tengrand/scores?limit=${Limit}&offset=${offset}`)
	}

	const limitChanged = (limit: number) => {
		router.push(`/tengrand/scores?limit=${limit}&offset=0`)
	}

	return (
		<div id="ten-grand-scores" className="m-2">
			<h1>Ten Grand Scores</h1>
			<div>
				{Items.map((ten_grand: TenGrand) => (
					<TenGrandScoreRow key={ten_grand.id} ten_grand={ten_grand} />
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
