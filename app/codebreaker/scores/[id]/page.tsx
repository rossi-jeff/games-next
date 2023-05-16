import { apiUrl } from '../../../../lib/api-url'
import { CodeBreaker } from '../../../../types/code-breaker.type'
import CodeBreakerGuessList from '../../code-breaker-guess-list'
import CodeBreakerSolution from '../../code-breaker-solution'
import Link from 'next/link'
import { Suspense } from 'react'
import DetailPlaceHolder from '../../../../components/detail-place-holder'

export async function generateStaticParams() {
	const results = await fetch(`${apiUrl}/api/code_breaker?Limit=100`)

	if (!results.ok) return []

	const { Items }: { Items: CodeBreaker[] } = await results.json()

	return Items.map((item) => ({ id: item.id }))
}

async function getCodeBreaker(id: string) {
	const result = await fetch(`${apiUrl}/api/code_breaker/${id}`)

	if (!result.ok) return {}

	const codeBreaker: CodeBreaker = await result.json()
	return codeBreaker
}

export default async function CodeBreakerScoreDetail({
	params,
}: {
	params: { id: string }
}) {
	const codeBreaker: CodeBreaker = await getCodeBreaker(params.id)
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
