'use client'

import { apiUrl } from '../../../../lib/api-url'
import { CodeBreaker } from '../../../../types/code-breaker.type'
import CodeBreakerGuessList from '../../code-breaker-guess-list'
import CodeBreakerSolution from '../../code-breaker-solution'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import LoadingIndicator from '../../../../components/loading-indicator'

export default function CodeBreakerScoreDetail() {
	const params = useParams()
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/code_breaker/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <LoadingIndicator />

	const codeBreaker: CodeBreaker = data
	return (
		<div id="code-breaker-detail" className="m-2">
			<h1>Code Breaker Score</h1>
			<Suspense fallback={<DetailPlaceHolder />}>
				{codeBreaker &&
					codeBreaker.guesses &&
					codeBreaker.guesses.length > 0 && (
						<CodeBreakerGuessList guesses={codeBreaker.guesses} />
					)}
				{codeBreaker && codeBreaker.codes && codeBreaker.codes.length > 0 && (
					<CodeBreakerSolution codes={codeBreaker.codes} />
				)}
			</Suspense>
			<Link href="/codebreaker/scores">Back To Scores</Link>
		</div>
	)
}
