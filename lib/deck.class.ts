import { Card } from './card.class'

export class Deck {
	cards: Card[] = []
	readonly suits: string[] = ['clubs', 'diamonds', 'hearts', 'spades']
	readonly faces: string[] = [
		'ace',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'jack',
		'queen',
		'king',
	]
	readonly backs: string[] = [
		'abstract_clouds',
		'abstract_scene',
		'abstract',
		'astronaut',
		'blue',
		'blue2',
		'cars',
		'castle',
		'fish',
		'frog',
		'red',
		'red2',
	]
	back: string = this.backs[0]
	readonly colors: { [key: string]: string } = {
		clubs: 'black',
		diamonds: 'red',
		hearts: 'red',
		spades: 'black',
	}

	constructor() {
		this.randomBack()
		this.build()
	}

	build() {
		this.cards = []
		let id = 1
		for (const suit of this.suits) {
			for (const face of this.faces) {
				const card = new Card(suit, face, this.back, id)
				this.cards.push(card)
				id++
			}
		}
	}

	randomBack() {
		this.back = this.backs[Math.floor(Math.random() * this.backs.length)]
	}

	setBack(idx: number) {
		const back = this.backs[idx]
		if (back) this.back = back
	}

	shuffle(times: number = 3) {
		if (!this.cards || !this.cards.length) return
		let tmp: Card,
			rnd: number,
			counter: number = 0
		while (counter < times) {
			for (let i = this.cards.length - 1; i > 0; i--) {
				tmp = this.cards[i]
				rnd = Math.floor(Math.random() * i)
				if (rnd != i) {
					this.cards[i] = this.cards[rnd]
					this.cards[rnd] = tmp
				}
			}
			counter++
		}
	}

	draw() {
		return this.cards.pop()
	}

	color(card: Card) {
		return this.colors[card.suit]
	}

	preload() {
		let images = [];
		let idx = 0;
		for (const back of this.backs) {
			images[idx] = new Image();
			images[idx].src = `/cards/back/${back}.svg`;
			idx++;
		}
		for (const card of this.cards) {
			images[idx] = new Image();
			images[idx].src = card.src;
			idx++;
		}
	}
}
