'use client'
import { useEffect } from 'react'
import { Card } from '../lib/card.class'
import Image from 'next/image'

export default function PlayingCard({
	card,
	from,
	level,
	index,
	click,
	dragStart,
}: {
	card: Card
	from: string
	level: number
	index: number
	click: Function
	dragStart: Function
}) {
	const id = `${from}_${level}_${card.id}_${index}`

	const onClick = () => {
		if (!card.clickable) return false
		click({ id })
	}

	const onDragStart = (ev: any) => {
		if (!card.draggable) {
			ev.preventDefault()
			return
		}
		dragStart(ev)
	}

	useEffect(() => {
		const top = level * 1.5 + 0.5
		const el = document.getElementById(id)
		if (el) el.style.top = `${top}rem`
	}, [level, id])

	useEffect(() => {
		const el = document.getElementById(id)
		if (el) {
			card.clickable
				? el.classList.add('clickable')
				: el.classList.remove('clickable')
			card.draggable
				? el.classList.add('draggable')
				: el.classList.remove('draggable')
		}
	}, [card, id])

	return (
		<div
			className="playing-card"
			id={id}
			draggable={card.draggable}
			onDragStart={(ev) => onDragStart(ev)}
			onClick={onClick}
		>
			<Image
				src={card.facedown ? card.backSrc : card.src}
				alt={card.facedown ? 'card back' : card.toString()}
				draggable={false}
				width={234}
				height={333}
			/>
		</div>
	)
}
