import { CodeBreakerCode } from '../../types/code-breaker-code.type'

export default function CodeBreakerSolution({
	codes,
}: {
	codes: CodeBreakerCode[]
}) {
	return (
		<div className="rounded-box flex flex-wrap">
			<div className="mr-2">
				<strong>Solution</strong>
			</div>
			<div className="code-breaker-codes">
				{codes &&
					codes.length > 0 &&
					codes.map((code) => <div key={code.id} className={code.Color}></div>)}
			</div>
		</div>
	)
}
