import Link from 'next/link'
import { HangMan } from '../../../types/hang-man.type'

export default function HangManScoreRow({ hang_man }: { hang_man: HangMan }) {
	return (
		<div className="score-row">
			<div className="cell-left">
				<Link href={'/hangman/scores/' + hang_man.id}>View</Link>
			</div>
			<div className="cell-center">
				{hang_man.user ? hang_man.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{hang_man.Status}</div>
			<div className="cell-center">{hang_man.Score}</div>
			<div className="cell-center">{hang_man.Correct}</div>
			<div className="cell-center">{hang_man.Wrong}</div>
			<div className="cell-right">
				{hang_man.word ? hang_man.word.Word : 'N/A'}
			</div>
		</div>
	)
}
