export default function YachtRollDisplay({
	roll,
	heading,
	label,
	rollDice,
	flag,
}: {
	roll: string
	heading: string
	label: string
	rollDice: Function
	flag: boolean
}) {
	const clickRoll = () => {
		rollDice()
	}
	return (
		<div className="yacht-roll-display">
			<h1>{heading}</h1>
			<div>{roll}</div>
			{!flag && <button onClick={() => clickRoll()}>{label}</button>}
		</div>
	)
}
