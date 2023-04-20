'use client'

import { useParams } from 'next/navigation'
import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { HangMan } from '../../../../types/hang-man.type'
import HangManDrawing from '../../hang-man-drawing'
import HangManLost from '../../hang-man-lost'
import HangManLetterButtons from '../../hang-man-letter-buttons'
import Link from 'next/link'
import { buildPaginatedUrl } from '../../../../lib/get-paginated-scores'
import { IdArray } from '../../../../types/id-array.type'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'

export async function generateStaticParams(): Promise<IdArray> {
	const url = buildPaginatedUrl('/api/hang_man', '100', '0')
	const result = await fetch(url.href)
	const data: { Items: HangMan[] } = await result.json()
	return data.Items.map((record: HangMan) => ({
		id: record.id ? record.id.toString() : '0',
	}))
}

export const dynamicParams = true

export default function HangManScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/hang_man/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const hangMan: HangMan = data
	return (
		<div id="hang-man-detail" className="m-2">
			<h1>Hang Man Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				<HangManDrawing wrong={hangMan.Wrong || ''} />
				{hangMan.word && hangMan.word.Word && (
					<HangManLost word={hangMan.word.Word} />
				)}
				<HangManLetterButtons
					correct={hangMan.Correct || ''}
					wrong={hangMan.Wrong || ''}
					guess={() => {}}
				/>
			</Suspense>
			<Link href="/hangman/scores">Back To Scores</Link>
		</div>
	)
}
