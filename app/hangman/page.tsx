'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import HangManDrawing from './hang-man-drawing'
import { HangMan } from '../../types/hang-man.type'
import HangManLetterButtons from './hang-man-letter-buttons'

export default function HangManGame() {
	const [hangMan, setHangMan] = useState<HangMan>({})
	const correct = 'a,e,i,o,u'
	const wrong = 'n,t,s,v'

	const guess = (ev: any) => {
		console.log(ev)
	}
	return (
		<div className="hang-man-game m-2">
			<h1>Hang Man</h1>
			<HangManDrawing wrong={hangMan.Wrong || ''} />
			<HangManLetterButtons correct={correct} wrong={wrong} guess={guess} />
			<Link href="/hangman/scores">Scores</Link>
		</div>
	)
}
