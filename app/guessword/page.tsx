'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { GuessWord } from '@/types/guess-word.type'
import GuessWordGuessForm from './guess-word-guess-form'
import { GameStatus } from '@/enum/game-status.enum'
import { Word } from '@/types/word.type'
import GuessWordGameOptions from './guess-word-game-options'
import { apiUrl } from '@/lib/api-url'
import { buildRequestHeaders } from '@/lib/build-request-headers'
import GuessWordHints from './guess-word-hints'
import { HintArgsType } from '@/types/hint-args.type'
import { Rating } from '@/enum/rating.enum'
import GuessWordGuessList from './guess-word-guess-list'
import useStorage, { SessionData, sessionKey } from '../../lib/session-storage'

export default function GuessWordGame() {
	const [guessWord, setGuessWord] = useState<GuessWord>({})
	const [word, setWord] = useState<Word>({})
	const [length, setLength] = useState<number>(5)
	const [hints, setHints] = useState<string[]>([])
	const [showHints, setShowHints] = useState<boolean>(false)

	const { getItem } = useStorage()
	const session: SessionData = getItem(sessionKey, 'session')

	const newGame = async (ev: any) => {
		const { Length } = ev
		setLength(Length)
		try {
			const result = await fetch(`${apiUrl}/api/word/random`, {
				method: 'POST',
				body: JSON.stringify({ Length }),
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const Word = await result.json()
				setWord(Word)
				if (Word.id) createGame(Word.id)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const createGame = async (WordId: number) => {
		try {
			const result = await fetch(`${apiUrl}/api/guess_word`, {
				method: 'POST',
				body: JSON.stringify({ WordId }),
				headers: buildRequestHeaders(session),
			})
			if (result.ok) {
				const game = await result.json()
				setGuessWord(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const sendGuess = async (ev: any) => {
		const { Guess } = ev
		const { Word } = word
		if (!Word || !guessWord.id) return
		try {
			const result = await fetch(
				`${apiUrl}/api/guess_word/${guessWord.id}/guess`,
				{
					method: 'POST',
					body: JSON.stringify({ Guess, Word }),
					headers: buildRequestHeaders(),
				}
			)
			if (result.ok) {
				await result.json()
				reloadGame()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const reloadGame = async () => {
		if (!guessWord.id) return
		try {
			const result = await fetch(`${apiUrl}/api/guess_word/${guessWord.id}`)
			if (result.ok) {
				const game = await result.json()
				setGuessWord(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const showChanged = (ev: any) => {
		const { show } = ev
		setShowHints(show)
	}

	useEffect(() => {
		if (showHints && length && guessWord.guesses && guessWord.guesses.length) {
			const args: HintArgsType = {
				Length: length,
				Green: [],
				Brown: [],
				Gray: [],
			}
			for (let i = 0; i < length; i++) {
				args.Green[i] = ''
				args.Brown[i] = []
			}
			if (guessWord && guessWord.guesses) {
				for (const guess of guessWord.guesses) {
					if (guess.ratings && guess.Guess) {
						for (let i = 0; i < length; i++) {
							const rating = guess.ratings[i]
							const letter = guess.Guess[i]
							if (rating.Rating == Rating.Green) {
								args.Green[i] = letter
							} else if (rating.Rating == Rating.Brown) {
								args.Brown[i].push(letter)
							} else {
								args.Gray.push(letter)
							}
						}
					}
				}
			}
			fetch(`${apiUrl}/api/guess_word/hint`, {
				method: 'POST',
				body: JSON.stringify(args),
				headers: buildRequestHeaders(),
			})
				.then((res) => res.json())
				.then((data) => {
					setHints(data)
				})
		} else {
			setHints([])
		}
	}, [guessWord, showHints, length])

	return (
		<div className="m-2">
			<h1>Guess Word</h1>
			{guessWord && guessWord.guesses && guessWord.guesses.length > 0 && (
				<GuessWordGuessList guesses={guessWord.guesses} />
			)}
			{guessWord && guessWord.Status == GameStatus.Playing ? (
				<GuessWordGuessForm length={length} sendGuess={sendGuess} />
			) : (
				<GuessWordGameOptions newGame={newGame} />
			)}

			{guessWord && guessWord.Status == GameStatus.Playing && (
				<GuessWordHints
					show={showHints}
					hints={hints}
					showChanged={showChanged}
				/>
			)}

			<Link href="/guessword/scores">Scores</Link>
		</div>
	)
}
