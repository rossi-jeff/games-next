import { CodeBreaker } from '../../../types/code-breaker.type'

export default function CodeBreakerScoreRow({
	code_breaker,
}: {
	code_breaker: CodeBreaker
}) {
	return (
		<div className="flex flex-wrap px-2 justify-between">
			<div>{code_breaker.id}</div>
			<div>{code_breaker.user ? code_breaker.user.UserName : 'Anonymous'}</div>
			<div>{code_breaker.Status}</div>
			<div>{code_breaker.Score}</div>
			<div>{code_breaker.Colors}</div>
			<div>{code_breaker.Columns}</div>
		</div>
	)
}
