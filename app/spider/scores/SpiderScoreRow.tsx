import React from 'react'
import type { Spider } from '../../../types/spider.type'
import { formatElapsed } from '../../../lib/clock.class'

export default function SpiderScoreRow({ spider }: { spider: Spider }) {
	return (
		<div className="score-row">
			<div className="cell-left">
				{spider.user ? spider.user.UserName : 'Anonymous'}
			</div>
			<div className="cell-center">{spider.Status}</div>
			<div className="cell-center">{spider.Suits}</div>
			<div className="cell-center">{formatElapsed(spider.Elapsed || 0)}</div>
			<div className="cell-right">{spider.Moves}</div>
		</div>
	)
}
