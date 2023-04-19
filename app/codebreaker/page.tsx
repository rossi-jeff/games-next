'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import CodeBreakerGameOptions from './code-breaker-game-options'
import { CodeBreaker } from '../../types/code-breaker.type'
import CodeBreakerGuessForm from './code-breaker-guess-form'
import { apiUrl } from '../../lib/api-url'
import { buildRequestHeaders } from '../../lib/build-request-headers'
import { GameStatus } from '../../enum/game-status.enum'
import CodeBreakerGuessList from './code-breaker-guess-list'
import CodeBreakerSolution from './code-breaker-solution'
import useStorage, { SessionData, sessionKey } from '../../lib/session-storage'

export default function CodeBreakerGame() {
	const [columns, setColumns] = useState<number>(4)
	const [available, setAvailable] = useState<string[]>([])
	const [codeBreaker, setCodeBreaker] = useState<CodeBreaker>({})

	const { getItem } = useStorage()
	const session: SessionData = getItem(sessionKey, 'session')

	const newGame = async (ev: any) => {
		const { Colors, Columns } = ev
		setColumns(Columns)
		setAvailable(Colors)
		try {
			const result = await fetch(`${apiUrl}/api/code_breaker`, {
				method: 'POST',
				body: JSON.stringify({ Colors, Columns }),
				headers: buildRequestHeaders(session),
			})
			if (result.ok) {
				const game = await result.json()
				setCodeBreaker(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const sendGuess = async (ev: any) => {
		if (!codeBreaker.id) return
		const { selected: Colors } = ev
		try {
			const result = await fetch(
				`${apiUrl}/api/code_breaker/${codeBreaker.id}/guess`,
				{
					method: 'POST',
					body: JSON.stringify({ Colors }),
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
		if (!codeBreaker.id) return
		try {
			const result = await fetch(`${apiUrl}/api/code_breaker/${codeBreaker.id}`)
			if (result.ok) {
				const game = await result.json()
				setCodeBreaker(game)
				console.log({ game })
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="m-2">
			<h1>Code Breaker</h1>
			{codeBreaker && codeBreaker.guesses && codeBreaker.guesses.length > 0 && (
				<CodeBreakerGuessList guesses={codeBreaker.guesses} />
			)}
			{codeBreaker &&
				codeBreaker.codes &&
				codeBreaker.codes.length > 0 &&
				codeBreaker.Status != GameStatus.Playing && (
					<CodeBreakerSolution codes={codeBreaker.codes} />
				)}
			{codeBreaker && codeBreaker.Status == GameStatus.Playing ? (
				<CodeBreakerGuessForm
					columns={columns}
					available={available}
					sendGuess={sendGuess}
				/>
			) : (
				<CodeBreakerGameOptions newGame={newGame} />
			)}

			<Link href="/codebreaker/scores">Scores</Link>
		</div>
	)
}
