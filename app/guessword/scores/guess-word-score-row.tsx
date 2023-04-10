import { GuessWord } from '../../../types/guess-word.type'
import React from 'react'

export default function GuessWordScoreRow({
	guess_word,
}: {
	guess_word: GuessWord
}) {
	return (
		<div className="flex flex-wrap px-2 justify-between">
			<div>{guess_word.id}</div>
			<div>{guess_word.user ? guess_word.user.UserName : 'Anonymous'}</div>
			<div>{guess_word.Status}</div>
			<div>{guess_word.Score}</div>
			<div>{guess_word.word ? guess_word.word.Word : 'N/A'}</div>
			<div>{guess_word.word ? guess_word.word.Length : 0}</div>
		</div>
	)
}
