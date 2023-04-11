import { CodeBreaker } from '../../../types/code-breaker.type'

export default function CodeBreakerScoreRow({
	code_breaker,
}: {
	code_breaker: CodeBreaker
}) {
	return (
		<div className="score-row">
			<div className="cell-left">{code_breaker.id}</div>
			<div className="cell-center">
				{code_breaker.user ? code_breaker.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{code_breaker.Status}</div>
			<div className="cell-center">{code_breaker.Score}</div>
			<div className="cell-center">{code_breaker.Colors}</div>
			<div className="cell-right">{code_breaker.Columns}</div>
		</div>
	)
}
