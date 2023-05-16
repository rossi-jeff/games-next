import { apiUrl } from '../../../../lib/api-url'
import { Yacht } from '../../../../types/yacht.type'
import YachtScoreCard from '../../yacht-score-card'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'

export async function generateStaticParams() {
	const results = await fetch(`${apiUrl}/api/yacht?Limit=100`)

	if (!results.ok) return []

	const { Items }: { Items: Yacht[] } = await results.json()

	return Items.map((item) => ({ id: item.id }))
}

async function getYacht(id: string) {
	const result = await fetch(`${apiUrl}/api/yacht/${id}`)

	if (!result.ok) return {}

	const yacht: Yacht = await result.json()
	return yacht
}

export default async function YachtScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const yacht: Yacht = await getYacht(params.id)

	return (
		<div id="yacht-detail" className="m-2">
			<h1>Yacht Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				<YachtScoreCard
					total={yacht.Total || 0}
					turns={yacht.turns && yacht.turns.length > 0 ? yacht.turns : []}
				/>
			</Suspense>
			<Link href="/yacht/scores">Back To Scores</Link>
		</div>
	)
}
