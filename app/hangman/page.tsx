'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import HangManDrawing from './hang-man-drawing'
import { HangMan } from '../../types/hang-man.type'
import HangManLetterButtons from './hang-man-letter-buttons'
import HangManWordDisplay from './hang-man-word-display'
import { Word } from '@/types/word.type'
import HangManGameOptions from './hang-man-game-options'
import { GameStatus } from '@/enum/game-status.enum'
import { apiUrl } from '@/lib/api-url'
import { buildRequestHeaders } from '@/lib/build-request-headers'
import HangManLost from './hang-man-lost'
import useStorage, { SessionData, sessionKey } from '../../lib/session-storage'
import HangManDiections from '../../components/hang-man-directions'

export default function HangManGame() {
	const [hangMan, setHangMan] = useState<HangMan>({})
	const [word, setWord] = useState<Word>({})
	const [letters, setLetters] = useState<string[]>([])

	const { getItem } = useStorage()
	const session: SessionData = getItem(sessionKey, 'session')

	const newGame = async (ev: any) => {
		const { Min, Max } = ev
		try {
			const result = await fetch(`${apiUrl}/api/word/random`, {
				method: 'POST',
				body: JSON.stringify({ Min, Max }),
				headers: buildRequestHeaders(session),
			})
			if (result.ok) {
				const w: Word = await result.json()
				if (w.id) createGame(w.id)
				setWord(w)
				updateDisplay('', w.Word || '')
			}
		} catch (error) {
			console.log(error)
		}
	}

	const createGame = async (WordId: number) => {
		try {
			const result = await fetch(`${apiUrl}/api/hang_man`, {
				method: 'POST',
				body: JSON.stringify({ WordId }),
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const game = await result.json()
				setHangMan(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const reloadGame = async () => {
		const { Word } = word
		if (!hangMan.id || !Word) return
		try {
			const result = await fetch(`${apiUrl}/api/hang_man/${hangMan.id}`)
			if (result.ok) {
				const game: HangMan = await result.json()
				setHangMan(game)
				updateDisplay(game.Correct || '', Word)
				console.log({ game })
			}
		} catch (error) {
			console.log(error)
		}
	}

	const updateDisplay = (correct: string, word: string) => {
		let current: string[] = []
		const correctArray = correct.split(',').filter((l) => l.length == 1)
		for (let i = 0; i < word.length; i++) {
			current[i] = correctArray.includes(word[i]) ? word[i] : ''
		}
		setLetters(current)
	}

	const guess = async (ev: any) => {
		const { letter } = ev
		const { Word } = word
		if (!Word || !hangMan.id) return
		try {
			const result = await fetch(`${apiUrl}/api/hang_man/${hangMan.id}/guess`, {
				method: 'POST',
				body: JSON.stringify({ Word, Letter: letter.toLowerCase() }),
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				await result.json()
				reloadGame()
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="hang-man-game m-2">
			<div className="flex flex-wrap justify-between">
				<h1>Hang Man</h1>
				<Link href="/hangman/scores">Scores</Link>
			</div>

			<HangManDrawing wrong={hangMan.Wrong || ''} />
			{(hangMan.Status == GameStatus.Lost ||
				hangMan.Status == GameStatus.Won) &&
				word.Word != undefined && <HangManLost word={word.Word} />}
			{hangMan.Status == GameStatus.Playing ? (
				<div>
					<HangManWordDisplay letters={letters} />
					<HangManLetterButtons
						correct={hangMan.Correct || ''}
						wrong={hangMan.Wrong || ''}
						guess={guess}
					/>
				</div>
			) : (
				<HangManGameOptions newGame={newGame} />
			)}
			{hangMan && hangMan.Status != GameStatus.Playing && <HangManDiections />}
		</div>
	)
}
