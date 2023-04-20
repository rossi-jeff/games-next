'use client'

import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { HangMan } from '../../../../types/hang-man.type'
import HangManDrawing from '../../hang-man-drawing'
import HangManLost from '../../hang-man-lost'
import HangManLetterButtons from '../../hang-man-letter-buttons'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'
import { useParams } from 'next/navigation'

export const dynamicParams = true

export default function HangManScoreDetail() {
	const params = useParams()
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
