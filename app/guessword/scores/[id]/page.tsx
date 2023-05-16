import { apiUrl } from '../../../../lib/api-url'
import { GuessWord } from '../../../../types/guess-word.type'
import GuessWordGuessList from '../../guess-word-guess-list'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'

export async function generateStaticParams() {
	const results = await fetch(`${apiUrl}/api/guess_word?Limit=100`)

	if (!results.ok) return []

	const { Items }: { Items: GuessWord[] } = await results.json()

	return Items.map((item) => ({ id: item.id }))
}

async function getGuessWord(id: string) {
	const result = await fetch(`${apiUrl}/api/guess_word/${id}`)

	if (!result.ok) return {}

	const guessWord: GuessWord = await result.json()
	return guessWord
}

export default async function GuessWordScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const guessWord: GuessWord = await getGuessWord(params.id)
	return (
		<div id="guess-word-detail" className="m-2">
			<h1>Guess Word Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				{guessWord && guessWord.guesses && guessWord.guesses.length > 0 && (
					<GuessWordGuessList guesses={guessWord.guesses} />
				)}
			</Suspense>
			<Link href="/guessword/scores">Back To Scores</Link>
		</div>
	)
}
