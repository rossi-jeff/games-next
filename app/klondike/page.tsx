'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { Deck } from '@/lib/deck.class'
import { Card } from '@/lib/card.class'
import { CardContainerType } from '@/types/card-container.type'
import { Klondike } from '@/types/klondike.type'
import { GameStatus } from '@/enum/game-status.enum'
import { formatElapsed } from '@/lib/clock.class'
import PlayingCard from '@/components/playing-card'
import { apiUrl } from '@/lib/api-url'
import { buildRequestHeaders } from '@/lib/build-request-headers'
import useStorage, { SessionData, sessionKey } from '../../lib/session-storage'
import KlondikeDirections from '../../components/klondike-directions'

export default function KlondikeGame() {
	let deck: Deck | undefined
	let card: Card | undefined
	const aceID = ['aces-0', 'aces-1', 'aces-2', 'aces-3']
	const tableauID = [
		'tableau-0',
		'tableau-1',
		'tableau-2',
		'tableau-3',
		'tableau-4',
		'tableau-5',
		'tableau-6',
	]
	const [aces, setAces] = useState<CardContainerType>({})
	const [tableau, setTableau] = useState<CardContainerType>({})
	const [stock, setStock] = useState<Card[]>([])
	const [waste, setWaste] = useState<Card[]>([])
	const moves = useRef(0)
	const [canAutoComplete, setCanAutoComplete] = useState(false)
	const timeout = useRef<ReturnType<typeof setTimeout> | undefined>()
	const [klondike, setKlondike] = useState<Klondike>({})

	const { getItem } = useStorage()
	const session: SessionData = getItem(sessionKey, 'session')

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
		let Aces: CardContainerType = {}
		let Stock: Card[] = []
		let Waste: Card[] = []
		for (const id of tableauID) Tableau[id] = []
		for (const id of aceID) Aces[id] = []
		for (let i = 0; i < 7; i++) {
			for (let j = i; j < 7; j++) {
				card = deck.draw()
				if (card && Tableau[tableauID[j]]) {
					if (i == j) {
						card.facedown = false
						card.draggable = true
					}
					Tableau[tableauID[j]].push(card)
				}
			}
		}
		while (deck.cards.length) {
			card = deck.draw()
			if (card) {
				card.clickable = true
				card.facedown = true
				Stock.push(card)
			}
		}
		setAces(Aces)
		setStock(Stock)
		setWaste(Waste)
		setTableau(Tableau)
		moves.current = 0
		clock.start()
		createGame()
	}

	const createGame = async () => {
		try {
			const result = await fetch(`${apiUrl}/api/klondike`, {
				method: 'POST',
				headers: buildRequestHeaders(session),
			})
			if (result.ok) {
				const game = await result.json()
				setKlondike(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const updateGame = async (Status: GameStatus) => {
		if (!klondike.id) return
		try {
			const result = await fetch(`${apiUrl}/api/klondike/${klondike.id}`, {
				method: 'PATCH',
				body: JSON.stringify({
					Moves: moves.current,
					Elapsed: elapsed,
					Status,
				}),
				headers: buildRequestHeaders(),
			})
			if (result.ok) {
				const game = await result.json()
				setKlondike(game)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const quit = () => {
		clock.pause()
		let Tableau: CardContainerType = {}
		let Aces: CardContainerType = {}
		let Stock: Card[] = []
		let Waste: Card[] = []
		for (const id of tableauID) Tableau[id] = []
		for (const id of aceID) Aces[id] = []
		setAces(Aces)
		setStock(Stock)
		setWaste(Waste)
		setTableau(Tableau)
		updateGame(GameStatus.Lost)
	}

	const autoComplete = () => {
		deck = new Deck()
		let lowestCard: Card | undefined
		let lastCard: Card | undefined
		let Tableau: CardContainerType = { ...tableau }
		let Aces: CardContainerType = { ...aces }
		let fromStack: string | undefined
		let toStack: string | undefined
		for (const id of tableauID) {
			if (Tableau[id] && Tableau[id].length) {
				lastCard = Tableau[id][Tableau[id].length - 1]
				if (
					lastCard &&
					(!lowestCard ||
						deck.faces.indexOf(lastCard.face) <
							deck.faces.indexOf(lowestCard.face))
				) {
					lowestCard = lastCard
					fromStack = id
				}
			}
		}
		if (lowestCard && fromStack) {
			for (const id of aceID) {
				if (Aces[id]) {
					if (Aces[id].length) {
						lastCard = Aces[id][Aces[id].length - 1]
						if (
							lastCard &&
							lastCard.suit == lowestCard.suit &&
							deck.faces.indexOf(lowestCard.face) ==
								deck.faces.indexOf(lastCard.face) + 1
						)
							toStack = id
					} else if (lowestCard.face == 'ace') {
						toStack = id
					}
				}
			}
			if (toStack) {
				card = Tableau[fromStack].pop()
				if (card) {
					card.draggable = false
					Aces[toStack].push(card)
					setAces(Aces)
					setTableau(Tableau)
					moves.current++
					timeout.current = setTimeout(() => autoComplete(), 250)
				}
			}
		} else checkProgress(Aces, Tableau, waste)
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

	const moveCards = (from: string, id: number, container: string) => {
		const { fromType, toType } = getStacks(from, container)
		const toMove: Card[] = []
		let Tableau: CardContainerType = { ...tableau }
		let Aces: CardContainerType = { ...aces }
		let Waste: Card[] = [...waste]
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
				if (Tableau[from].length) {
					card = Tableau[from][Tableau[from].length - 1]
					card.facedown = false
					card.draggable = true
				}
				break
			case 'waste':
				while (!found) {
					card = Waste.pop()
					if (card) {
						toMove.push(card)
						if (card.id == id) found = true
					}
				}
		}
		switch (toType) {
			case 'aces':
				while (toMove.length) {
					card = toMove.pop()
					if (card) {
						card.draggable = false
						Aces[container].push(card)
					}
				}
				break
			case 'tableau':
				while (toMove.length) {
					card = toMove.pop()
					if (card) {
						Tableau[container].push(card)
					}
				}
				break
		}
		setAces(Aces)
		setWaste(Waste)
		setTableau(Tableau)
		moves.current++
		checkProgress(Aces, Tableau, Waste)
	}

	const checkProgress = (
		Aces: CardContainerType,
		Tableau: CardContainerType,
		Waste: Card[]
	) => {
		let Stock: Card[] = [...stock]
		let aceCount = 0
		for (const id of aceID) {
			if (Aces[id]) aceCount += Aces[id].length
		}
		let faceDownCount = 0
		for (const id of tableauID) {
			if (Tableau[id] && Tableau[id].length) {
				for (const card of Tableau[id]) if (card.facedown) faceDownCount++
			}
		}
		if (aceCount == 52) {
			clock.pause()
			setCanAutoComplete(false)
			updateGame(GameStatus.Won)
		} else
			setCanAutoComplete(
				Stock.length == 0 && Waste.length == 0 && faceDownCount == 0
			)
	}

	const canDrop = (from: string, id: number, container: string) => {
		const { fromStack, fromType, toStack, toType } = getStacks(from, container)
		if (!fromStack || !toStack) return false
		const draggedCard = fromStack.find((c) => c.id == id)
		if (!draggedCard) return false
		const idx = fromStack.findIndex((c) => c.id == id)
		const quantity = fromStack.length - idx
		const topCard = toStack[toStack.length - 1]
		deck = new Deck()
		switch (toType) {
			case 'tableau':
				if (topCard == undefined && draggedCard.face == 'king') return true
				return topCard &&
					deck.color(draggedCard) != deck.color(topCard) &&
					deck.faces.indexOf(topCard.face) ==
						deck.faces.indexOf(draggedCard.face) + 1
					? true
					: false
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

	const getStacks = (from: string, container: string) => {
		const fromType = from.split('-').shift()
		const toType = container.split('-').shift()
		let fromStack: Card[] | undefined
		let toStack: Card[] | undefined
		switch (fromType) {
			case 'tableau':
				fromStack = tableau[from]
				break
			case 'waste':
				fromStack = waste
				break
			case 'aces':
				fromStack = aces[from]
				break
		}
		switch (toType) {
			case 'tableau':
				toStack = tableau[container]
				break
			case 'aces':
				toStack = aces[container]
				break
		}
		return { fromType, toType, fromStack, toStack }
	}

	const stockCardClicked = (event: any) => {
		const { id } = event
		let cardId = parseInt(id.split('_')[2])
		let Stock: Card[] = [...stock]
		let Waste: Card[] = [...waste]
		card = Stock.pop()
		if (card && card.id == cardId) {
			card.facedown = false
			card.clickable = false
			card.draggable = true
			Waste.push(card)
			setStock(Stock)
			setWaste(Waste)
		}
	}

	const stockContainerClicked = () => {
		let Stock: Card[] = [...stock]
		let Waste: Card[] = [...waste]
		if (Stock.length || !Waste.length) return
		while (Waste.length) {
			card = Waste.pop()
			if (card) {
				card.draggable = false
				card.clickable = true
				card.facedown = true
				Stock.push(card)
			}
		}
		setStock(Stock)
		setWaste(Waste)
	}

	return (
		<div id="klondike-game" className="m-2">
			<div className="flex flex-wrap justify-between">
				<h1>Klondike</h1>
				<Link href="/klondike/scores">Scores</Link>
			</div>

			<div className="flex flex-wrap justify-between">
				<div>
					{klondike.Status != GameStatus.Playing && (
						<button onClick={deal}>Deal</button>
					)}
					{klondike.Status == GameStatus.Playing && (
						<button onClick={quit}>Quit</button>
					)}
					{canAutoComplete && (
						<button className="ml-2" onClick={autoComplete}>
							Auto Complete
						</button>
					)}
				</div>
				<div>
					<strong className="mr-2">Status</strong>
					{klondike.Status ? klondike.Status : 'N/A'}
				</div>
				<div>
					<strong className="mr-2">Moves</strong>
					{moves.current}
				</div>
				<div>
					<strong className="mr-2">Time</strong>
					{formatElapsed(elapsed)}
				</div>
			</div>
			<div className="flex flex-wrap justify-between my-2">
				<div id="control-cells" className="flex flex-wrap">
					<div
						id="stock"
						className="card-container mr-2"
						onClick={stockContainerClicked}
					>
						{stock.length > 0 &&
							stock.map((card, index) => (
								<PlayingCard
									key={card.id}
									card={card}
									level={0}
									index={index}
									from="stock"
									dragStart={() => {}}
									click={stockCardClicked}
								/>
							))}
					</div>
					<div id="waste" className="card-container">
						{waste.length > 0 &&
							waste.map((card, index) => (
								<PlayingCard
									key={card.id}
									card={card}
									level={0}
									index={index}
									from="waste"
									click={() => {}}
									dragStart={dragStart}
								/>
							))}
					</div>
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
			<div id="tableau-cells" className="flex flex-wrap justify-between mb-4">
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
			{klondike.Status != GameStatus.Playing && <KlondikeDirections />}
		</div>
	)
}
