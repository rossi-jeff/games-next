'use client'

import { useParams } from 'next/navigation'
import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { TenGrand } from '../../../../types/ten-grand.type'
import TenGrandScoreCard from '../../ten-grand-score-card'
import Link from 'next/link'

export default function TenGrandScoreDetail() {
	const params = useParams()
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/ten_grand/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const tenGrand: TenGrand = data

	return (
		<div id="ten-grand-detail" className="m-2">
			<h1>Ten Grand Score</h1>
			<TenGrandScoreCard
				turns={
					tenGrand.turns && tenGrand.turns.length > 0 ? tenGrand.turns : []
				}
			/>
			<Link href="/tengrand/scores">Back To Scores</Link>
		</div>
	)
}
