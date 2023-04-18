'use client'

import { useParams } from 'next/navigation'
import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { GuessWord } from '../../../../types/guess-word.type'
import GuessWordGuessList from '../../guess-word-guess-list'
import Link from 'next/link'

export default function GuessWordScoreDetail() {
	const params = useParams()
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
			{guessWord && guessWord.guesses && guessWord.guesses.length > 0 && (
				<GuessWordGuessList guesses={guessWord.guesses} />
			)}
			<Link href="/guessword/scores">Back To Scores</Link>
		</div>
	)
}
