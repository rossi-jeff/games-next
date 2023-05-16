import { apiUrl } from '../../../../lib/api-url'
import { TenGrand } from '../../../../types/ten-grand.type'
import TenGrandScoreCard from '../../ten-grand-score-card'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'

export async function generateStaticParams() {
	const results = await fetch(`${apiUrl}/api/ten_grand?Limit=100`)

	if (!results.ok) return []

	const { Items }: { Items: TenGrand[] } = await results.json()

	return Items.map((item) => ({ id: item.id }))
}

async function getTenGrand(id: string) {
	const result = await fetch(`${apiUrl}/api/ten_grand/${id}`)

	if (!result.ok) return {}

	const tenGrand: TenGrand = await result.json()
	return tenGrand
}

export default async function TenGrandScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const tenGrand: TenGrand = await getTenGrand(params.id)

	return (
		<div id="ten-grand-detail" className="m-2">
			<h1>Ten Grand Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				<TenGrandScoreCard
					turns={
						tenGrand.turns && tenGrand.turns.length > 0 ? tenGrand.turns : []
					}
				/>
			</Suspense>
			<Link href="/tengrand/scores">Back To Scores</Link>
		</div>
	)
}
