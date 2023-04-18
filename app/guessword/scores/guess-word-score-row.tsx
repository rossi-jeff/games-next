import Link from 'next/link'
import { GuessWord } from '../../../types/guess-word.type'
import React from 'react'

export default function GuessWordScoreRow({
	guess_word,
}: {
	guess_word: GuessWord
}) {
	return (
		<div className="score-row">
			<div className="cell-left">
				<Link href={'/guessword/scores/' + guess_word.id}>View</Link>
			</div>
			<div className="cell-center">
				{guess_word.user ? guess_word.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{guess_word.Status}</div>
			<div className="cell-center">{guess_word.Score}</div>
			<div className="cell-center">
				{guess_word.word ? guess_word.word.Word : 'N/A'}
			</div>
			<div className="cell-right">
				{guess_word.word ? guess_word.word.Length : 0}
			</div>
		</div>
	)
}
