'use client'

import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { GuessWord } from '../../../../types/guess-word.type'
import GuessWordGuessList from '../../guess-word-guess-list'
import Link from 'next/link'
import { buildPaginatedUrl } from '../../../../lib/get-paginated-scores'
import { IdArray } from '../../../../types/id-array.type'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'

export async function generateStaticParams(): Promise<IdArray> {
	const url = buildPaginatedUrl('/api/guess_word', '100', '0')
	const result = await fetch(url.href)
	const data: { Items: GuessWord[] } = await result.json()
	return data.Items.map((record: GuessWord) => ({
		id: record.id ? record.id.toString() : '0',
	}))
}

export const dynamicParams = true

export default function GuessWordScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/guess_word/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const guessWord: GuessWord = data
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
