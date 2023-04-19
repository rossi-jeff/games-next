'use client'

import { apiUrl } from '../../../../lib/api-url'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { CodeBreaker } from '../../../../types/code-breaker.type'
import CodeBreakerGuessList from '../../code-breaker-guess-list'
import CodeBreakerSolution from '../../code-breaker-solution'
import Link from 'next/link'
import { IdArray } from '../../../../types/id-array.type'
import { buildPaginatedUrl } from '../../../../lib/get-paginated-scores'

export async function generateStaticParams(): Promise<IdArray> {
	const url = buildPaginatedUrl('/api/code_breaker', '100', '0')
	const result = await fetch(url.href)
	const data: { Items: CodeBreaker[] } = await result.json()
	return data.Items.map((record: CodeBreaker) => ({
		id: record.id ? record.id.toString() : '0',
	}))
}

export const dynamicParams = true

export default function CodeBreakerScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const { data, error, isLoading } = useSWR(
		`${apiUrl}/api/code_breaker/${params.id}`,
		fetcher
	)

	if (error) return <div>{error}</div>
	if (isLoading) return <div>Loading ...</div>

	const codeBreaker: CodeBreaker = data
	return (
		<div id="code-breaker-detail" className="m-2">
			<h1>Code Breaker Score</h1>
			{codeBreaker && codeBreaker.guesses && codeBreaker.guesses.length > 0 && (
				<CodeBreakerGuessList guesses={codeBreaker.guesses} />
			)}
			{codeBreaker && codeBreaker.codes && codeBreaker.codes.length > 0 && (
				<CodeBreakerSolution codes={codeBreaker.codes} />
			)}
			<Link href="/codebreaker/scores">Back To Scores</Link>
		</div>
	)
}
