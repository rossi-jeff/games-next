'use client'

import { useEffect } from 'react'

export default function HangManDrawing({ wrong }: { wrong: string }) {
	useEffect(() => {
		const parts: string[] = [
			'head',
			'body',
			'left-arm',
			'right-arm',
			'left-leg',
			'right-leg',
		]
		const length = wrong.split(',').filter((l) => l.length == 1).length
		let el
		for (const part of parts) {
			el = document.getElementById(part)
			if (el) el.classList.remove('visible')
		}
		for (let i = 0; i < length; i++) {
			el = document.getElementById(parts[i])
			if (el) el.classList.add('visible')
		}
	}, [wrong])

	return (
		<div className="hang-man-drawing">
			<div id="gallows-top"></div>
			<div id="gallows-left"></div>
			<div id="gallows-bottom"></div>
			<div id="rope"></div>
			<div id="head"></div>
			<div id="body"></div>
			<div id="left-arm"></div>
			<div id="right-arm"></div>
			<div id="left-leg"></div>
			<div id="right-leg"></div>
		</div>
	)
}
