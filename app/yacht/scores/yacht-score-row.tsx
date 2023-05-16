import Link from 'next/link'
import { Yacht } from '../../../types/yacht.type'
import React from 'react'

export default function YachtScoreRow({ yacht }: { yacht: Yacht }) {
	return (
		<div className="score-row">
			<div className="cell-left">
				<Link href={'/yacht/scores/' + yacht.id} prefetch={false}>
					View
				</Link>
			</div>
			<div className="cell-center">
				{yacht.user ? yacht.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-right">{yacht.Total}</div>
		</div>
	)
}
