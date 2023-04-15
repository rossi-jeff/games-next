'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { Deck } from '../../lib/deck.class'
import { Card } from '../../lib/card.class'
import { CardContainerType } from '../../types/card-container.type'
import PlayingCard from '../../components/playing-card'
import { formatElapsed } from '@/lib/clock.class'
import { GameStatus } from '../../enum/game-status.enum'
import { apiUrl } from '../../lib/api-url'
import { buildRequestHeaders } from '../../lib/build-request-headers'
import { FreeCell } from '../../types/free-cell.type'
import { diceDoubleThreeKind } from '../../../games-nest/src/ten-grand/ten-grand-functions'

export default function FreeCellGame() {
	let deck: Deck | undefined
	let card: Card | undefined
	const aceID = ['aces-0', 'aces-1', 'aces-2', 'aces-3']
	const freeID = ['free-0', 'free-1', 'free-2', 'free-3']
	const tableauID = [
		'tableau-0',
		'tableau-1',
		'tableau-2',
		'tableau-3',
		'tableau-4',
		'tableau-5',
		'tableau-6',
		'tableau-7',
	]
	const [aces, setAces] = useState<CardContainerType>({})
	const [free, setFree] = useState<CardContainerType>({})
	const [tableau, setTableau] = useState<CardContainerType>({})
	const [freeCell, setFreeCell] = useState<FreeCell>({})
	const [moves, setMoves] = useState(0)

	// begin timer code
	const [elapsed, setElapsed] = useState(0)
	const initial = useRef(0)
	const paused = useRef(0)
	const interval = useRef<ReturnType<typeof setInterval> | undefined>()

	const clock = {
		start() {
			initial.current = Date.now()
			if (interval.current) {
				clearInterval(interval.current)
				interval.current = undefined
			}
			setElapsed(0)
			interval.current = setInterval(() => clock.tick(), 1000)
		},
		pause() {
			if (interval.current) {
				clearInterval(interval.current)
				interval.current = undefined
			}
			paused.current = Date.now()
			console.log('pause', elapsed)
		},
		resume() {
			if (interval.current) {
				clearInterval(interval.current)
				interval.current = undefined
			}
			if (paused.current) {
				const offset = Math.round((Date.now() - paused.current) / 1000)
				initial.current = initial.current + offset
			}
			interval.current = setInterval(() => clock.tick(), 1000)
			console.log('resume', elapsed)
		},
		tick() {
			setElapsed(Math.round((Date.now() - initial.current) / 1000))
		},
	}
	// end timer code

	const deal = () => {
		deck = new Deck()
		deck.preload()
		deck.shuffle()
		let Tableau: CardContainerType = {}
		let Free: CardContainerType = {}
		let Aces: CardContainerType = {}
		for (const id of tableauID) Tableau[id] = []
		for (const id of freeID) Free[id] = []
		for (const id of aceID) Aces[id] = []
		setAces(Aces)
		setFree(Free)
		let counter = 0
		while (deck.cards.length) {
			card = deck.draw()
			if (card) {
				card.draggable = true
				card.facedown = false
				Tableau[tableauID[counter]].push(card)
			}
			counter++
			if (counter >= tableauID.length) counter = 0
		}
		Tableau = adjustDraggableTableau(Tableau)
		setTableau(Tableau)
		setMoves(0)
		clock.start()
		createGame()
	}

	const createGame = async () => {
		try {
			const result = await fetch(`${apiUrl}/api/free_cell`, {
				method: 'POST',
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const game = await result.json()
				setFreeCell(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const updateGame = async (Status: GameStatus) => {
		if (!freeCell.id) return
		try {
			const result = await fetch(`${apiUrl}/api/free_cell/${freeCell.id}`, {
				method: 'PATCH',
				body: JSON.stringify({ Moves: moves, Elapsed: elapsed, Status }),
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const game = await result.json()
				setFreeCell(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const quit = () => {
		clock.pause()
		updateGame(GameStatus.Lost)
	}

	const dragStart = (event: any) => {
		if (event.target) event.dataTransfer.setData('text', event.target.id)
		else if (event.detail)
			event.detail.dataTransfer.setData('text', event.detail.target.id)
	}

	const dragOver = (event: any) => {
		event.preventDefault()
	}

	const dragEnter = (event: any) => {
		let { target } = event
		if (target) {
			while (target && !target.classList.contains('card-container')) {
				target = target.parentElement
			}
			target.classList.add('over')
			setTimeout(() => target.classList.remove('over'), 500)
		}
	}

	const drop = (event: any) => {
		event.preventDefault()
		event.stopPropagation()
		const data = event.dataTransfer.getData('text')
		let [from, level, id, index] = data.split('_')
		level = parseInt(level)
		id = parseInt(id)
		index = parseInt(index)
		let { target } = event
		let container: string = ''
		if (target) {
			while (target && !target.classList.contains('card-container')) {
				target = target.parentElement
			}
			container = target.id
		}
		if (canDrop(from, id, container)) moveCards(from, id, container)
	}

	const getStacks = (from: string, container: string) => {
		const fromType = from.split('-').shift()
		const toType = container.split('-').shift()
		let fromStack: Card[] | undefined
		let toStack: Card[] | undefined
		switch (fromType) {
			case 'tableau':
				fromStack = tableau[from]
				break
			case 'free':
				fromStack = free[from]
				break
			case 'aces':
				fromStack = aces[from]
				break
		}
		switch (toType) {
			case 'tableau':
				toStack = tableau[container]
				break
			case 'free':
				toStack = free[container]
				break
			case 'aces':
				toStack = aces[container]
				break
		}
		return { fromType, toType, fromStack, toStack }
	}

	const canDrop = (from: string, id: number, container: string) => {
		if (from == container) return false
		const { fromStack, toStack, toType } = getStacks(from, container)
		if (!fromStack || !toStack) return false
		const draggedCard = fromStack.find((c) => c.id == id)
		if (!draggedCard) return false
		const idx = fromStack.findIndex((c) => c.id == id)
		const quantity = fromStack.length - idx
		const available = maxFreeSpace()
		const topCard = toStack[toStack.length - 1]
		deck = new Deck()
		switch (toType) {
			case 'tableau':
				if (quantity > available) return false
				if (topCard == undefined) return true
				return deck.color(draggedCard) != deck.color(topCard) &&
					deck.faces.indexOf(topCard.face) ==
						deck.faces.indexOf(draggedCard.face) + 1
					? true
					: false
			case 'free':
				if (quantity > 1) return false
				return topCard == undefined
			case 'aces':
				if (quantity > 1) return false
				if (draggedCard.face == 'ace' && topCard == undefined) return true
				return topCard != undefined &&
					topCard.suit == draggedCard.suit &&
					deck.faces.indexOf(draggedCard.face) ==
						deck.faces.indexOf(topCard.face) + 1
					? true
					: false
		}
	}

	const moveCards = (from: string, id: number, container: string) => {
		const { fromType, toType } = getStacks(from, container)
		const toMove: Card[] = []
		let Tableau: CardContainerType = { ...tableau }
		let Free: CardContainerType = { ...free }
		let Aces: CardContainerType = { ...aces }
		let found: boolean = false
		switch (fromType) {
			case 'tableau':
				while (!found) {
					card = Tableau[from].pop()
					if (card) {
						toMove.push(card)
						if (card.id == id) found = true
					}
				}
				break
			case 'free':
				while (!found) {
					card = Free[from].pop()
					if (card) {
						toMove.push(card)
						if (card.id == id) found = true
					}
				}
				break
			case 'aces':
				while (!found) {
					card = Aces[from].pop()
					if (card) {
						toMove.push(card)
						if (card.id == id) found = true
					}
				}
				break
		}
		switch (toType) {
			case 'tableau':
				while (toMove.length) {
					card = toMove.pop()
					if (card) {
						Tableau[container].push(card)
					}
				}
				break
			case 'free':
				while (toMove.length) {
					card = toMove.pop()
					if (card) {
						Free[container].push(card)
					}
				}
				break
			case 'aces':
				while (toMove.length) {
					card = toMove.pop()
					if (card) {
						card.draggable = false
						Aces[container].push(card)
					}
				}
				break
		}
		Tableau = adjustDraggableTableau(Tableau)
		setTableau(Tableau)
		setFree(Free)
		setAces(Aces)
		setMoves(moves + 1)
		checkProgress(Aces)
	}

	const checkProgress = (Aces: CardContainerType) => {
		let aceCount = 0
		for (const id of aceID) {
			if (Aces[id]) aceCount += Aces[id].length
		}
		if (aceCount == 52) {
			clock.pause()
			updateGame(GameStatus.Won)
		}
	}

	const maxFreeSpace = () => {
		let emptyFree = 0
		let emptyTableau = 0
		for (const id of tableauID) {
			if (tableau[id] && tableau[id].length == 0) emptyTableau++
		}
		for (const id of freeID) {
			if (free[id] && free[id].length == 0) emptyFree++
		}
		return emptyTableau * emptyFree + emptyFree + 1
	}

	const adjustDraggableTableau = (Tableau: CardContainerType) => {
		if (!deck) return Tableau
		let current: Card | undefined
		let previous: Card | undefined
		for (const id of tableauID) {
			if (Tableau[id] && Tableau[id].length) {
				previous = undefined
				current = undefined
				for (let i = Tableau[id].length - 1; i >= 0; i--) {
					current = Tableau[id][i]
					if (previous) {
						current.draggable =
							deck.color(previous) != deck.color(current) &&
							deck.faces.indexOf(current.face) ==
								deck.faces.indexOf(previous.face) + 1
					} else current.draggable = true
					previous = current
				}
			}
		}
		return Tableau
	}

	return (
		<div id="free-cell-game" className="m-2">
			<h1>Free Cell</h1>
			<div className="flex flex-wrap justify-between">
				<div>
					{freeCell.Status != GameStatus.Playing && (
						<button onClick={deal}>Deal</button>
					)}
					{freeCell.Status == GameStatus.Playing && (
						<button onClick={quit}>Quit</button>
					)}
				</div>
				<div>
					<strong className="mr-2">Status</strong>
					{freeCell.Status ? freeCell.Status : 'N/A'}
				</div>
				<div>
					<strong className="mr-2">Moves</strong>
					{moves}
				</div>
				<div>
					<strong className="mr-2">Time</strong>
					{formatElapsed(elapsed)}
				</div>
			</div>
			<div className="flex flex-wrap justify-between my-2">
				<div id="free-cells" className="flex flex-wrap">
					{freeID.map((id) => (
						<div
							key={id}
							id={id}
							className="card-container mr-2"
							onDragOver={dragOver}
							onDragEnter={dragEnter}
							onDrop={drop}
						>
							{free[id] &&
								free[id].map((card, index) => (
									<PlayingCard
										key={card.id}
										card={card}
										index={index}
										from={id}
										level={0}
										click={() => {}}
										dragStart={dragStart}
									/>
								))}
						</div>
					))}
				</div>
				<div id="ace-cells" className="flex flex-wrap">
					{aceID.map((id) => (
						<div
							key={id}
							id={id}
							className="card-container ml-2"
							onDragOver={dragOver}
							onDragEnter={dragEnter}
							onDrop={drop}
						>
							{aces[id] &&
								aces[id].map((card, index) => (
									<PlayingCard
										key={card.id}
										card={card}
										from={id}
										index={index}
										level={0}
										click={() => {}}
										dragStart={() => {}}
									/>
								))}
						</div>
					))}
				</div>
			</div>
			<div id="tableau-cells" className="flex flex-wrap justify-between">
				{tableauID.map((id) => (
					<div
						key={id}
						id={id}
						className="card-container"
						onDragOver={dragOver}
						onDragEnter={dragEnter}
						onDrop={drop}
					>
						{tableau[id] &&
							tableau[id].map((card, index) => (
								<PlayingCard
									key={card.id}
									from={id}
									level={index}
									index={index}
									card={card}
									dragStart={dragStart}
									click={() => {}}
								/>
							))}
					</div>
				))}
			</div>
			<Link href="/freecell/scores">Scores</Link>
		</div>
	)
}
