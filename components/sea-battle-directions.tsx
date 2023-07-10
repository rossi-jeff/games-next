export default function SeaBattleDirections() {
	const toggle = (accordion: string) => {
		const btn = document.getElementById(`${accordion}-button`)
		if (btn) btn.classList.toggle('open')
		const content = document.getElementById(`${accordion}-content`)
		if (content) content.classList.toggle('open')
	}
	return (
		<div id="sea-battle-directions" className="directions-container">
			<button
				className="directions-button"
				id="sea-battle-directions-button"
				onClick={() => toggle('sea-battle-directions')}
			>
				Rules & Directions
			</button>
			<div id="sea-battle-directions-content" className="directions-content">
				<h3>Directions</h3>
				<div className="mb-2">
					<div className="mb-2">
						Initially the player will select the length of horizontal and
						vertical axis and quantity of ships.
					</div>
					<div className="mb-2">
						The player will then sequentially place their ships on the grid, and
						the opponent will place the same type of ship.
					</div>
					<div className="mb-2">
						During the player&apos;s turn they will select the horizontal and
						vertical coordinates and fire their shot
					</div>
					<div className="mb-2">
						During the opponent&apos;s turn the player will press the button to
						trigger the opponent&apos;s move
					</div>
					<div className="mb-2">
						Game play will continue in alternating turns until either the
						player&apos;s or opponent&apos;s entire fleet has been sunk
					</div>
				</div>
				<h3>Scoring</h3>
				<div className="mb-2">
					<div>
						<ul>
							<li>
								<strong>Per Miss</strong>5
							</li>
							<li>
								<strong>Per Hit</strong>
								10
							</li>
							<li>
								<strong>Per Turn</strong>5
							</li>
							<li>
								<strong>Max Turns</strong>
								axis length * axis length * 2
							</li>
							<li>
								<strong>Max if Won</strong>
								max turns * per miss
							</li>
						</ul>
					</div>
					<div className="mb-2">
						Scoring will begin with either the max or zero depending on game
						status. After each turn the per turn amount is subtracted.
					</div>
					<div className="mb-2">
						During the player&apos;s turn, depnding on the fire results, the per
						miss amount will be subtracted, or the per hit amount will be added,
						or if the ship is sunk twice the per hit will be added.
					</div>
					<div className="mb-2">
						During the opponent&apos;s turn, depnding on the fire results, the
						per miss amount will be added, or the per hit amount will be
						subtracted, or if the ship is sunk twice the per hit will be
						subtracted.
					</div>
					<div>
						Additional info about{' '}
						<a
							href="https://en.wikipedia.org/wiki/Battleship_(game)"
							target="_blank"
							rel="noreferrer"
						>
							Sea Battle
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
