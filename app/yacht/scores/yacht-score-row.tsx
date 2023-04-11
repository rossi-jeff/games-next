import { Yacht } from '../../../types/yacht.type'
import React from 'react'

export default function YachtScoreRow({ yacht }: { yacht: Yacht }) {
	return (
		<div className="score-row">
			<div className="cell-left">{yacht.id}</div>
			<div className="cell-center">
				{yacht.user ? yacht.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-right">{yacht.Total}</div>
		</div>
	)
}
