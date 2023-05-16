import { apiUrl } from '../../../../lib/api-url'
import { HangMan } from '../../../../types/hang-man.type'
import HangManDrawing from '../../hang-man-drawing'
import HangManLost from '../../hang-man-lost'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'
import HangManGuessedLetters from './hang-man-guessed-letters'

export async function generateStaticParams() {
	const results = await fetch(`${apiUrl}/api/hang_man?Limit=100`)

	if (!results.ok) return []

	const { Items }: { Items: HangMan[] } = await results.json()

	return Items.map((item) => ({ id: item.id }))
}

async function getHangMan(id: string) {
	const result = await fetch(`${apiUrl}/api/hang_man/${id}`)

	if (!result.ok) return {}

	const hangMan: HangMan = await result.json()
	return hangMan
}

export default async function HangManScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const hangMan: HangMan = await getHangMan(params.id)
	return (
		<div id="hang-man-detail" className="m-2">
			<h1>Hang Man Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				<HangManDrawing wrong={hangMan.Wrong || ''} />
				{hangMan.word && hangMan.word.Word && (
					<HangManLost word={hangMan.word.Word} />
				)}
				<HangManGuessedLetters
					correct={hangMan.Correct || ''}
					wrong={hangMan.Wrong || ''}
				/>
			</Suspense>
			<Link href="/hangman/scores">Back To Scores</Link>
		</div>
	)
}
