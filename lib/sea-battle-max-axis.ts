import { alphabet } from './alphabet'

export const SeaBattleMaxAxis: { H: string[]; V: number[] } = {
	H: alphabet.toUpperCase().split(''),
	V: [...Array(26)].map((x, i) => i + 1),
}
