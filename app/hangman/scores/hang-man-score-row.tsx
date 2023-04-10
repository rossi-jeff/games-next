import { HangMan } from '../../../types/hang-man.type'

export default function HangManScoreRow({ hang_man }: { hang_man: HangMan }) {
	return (
		<div className="flex flex-wrap px-2 justify-between">
			<div>{hang_man.id}</div>
			<div>{hang_man.user ? hang_man.user.UserName : 'Anonymous'}</div>
			<div>{hang_man.Status}</div>
			<div>{hang_man.Score}</div>
			<div>{hang_man.Correct}</div>
			<div>{hang_man.Wrong}</div>
			<div>{hang_man.word ? hang_man.word.Word : 'N/A'}</div>
		</div>
	)
}
