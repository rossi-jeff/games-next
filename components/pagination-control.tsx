'use client'

import React, { useEffect, useState } from 'react'

export default function PaginationControl({
	count,
	limit,
	offset,
	limitChanged,
	pageChanged,
}: {
	count: number
	limit: number
	offset: number
	limitChanged: Function
	pageChanged: Function
}) {
	const [pages, setPages] = useState<number[]>([])
	const [current, setCurrent] = useState<number>(1)
	const perPage: number[] = [5, 10, 25]

	useEffect(() => {
		let pageArray: number[] = []
		let page = 1
		let counter = 0
		if (count > 0) {
			while (counter < count) {
				pageArray.push(page)
				page++
				counter += limit
			}
		} else {
			pageArray.push(page)
		}
		setPages(pageArray)
		setCurrent(Math.floor(offset / limit) + 1)
	}, [])

	const changedPage = (page: number) => {
		setCurrent(page)
		pageChanged(page)
	}

	const changedLimit = (ev: any) => {
		const idx = ev.target.selectedIndex
		limitChanged(perPage[idx])
	}

	return (
		<div className="flex flex-wrap mx-2 my-2 justify-between">
			<div>
				<label htmlFor="limit-select" className="font-bold">
					Per Page
				</label>
				<select
					name="limit-select"
					onChange={changedLimit}
					className="ml-2"
					defaultValue={limit}
				>
					{perPage.map((lim, idx) => (
						<option key={idx}>{lim}</option>
					))}
				</select>
			</div>
			<div className="flex flex-wrap justify-end">
				{pages.map((page) => {
					return page == current ? (
						<div
							key={page}
							className="font-bold ml-2 px-2 py-1 bg-slate-600 rounded"
						>
							{page}
						</div>
					) : (
						<button
							key={page}
							className="ml-2"
							onClick={() => changedPage(page)}
						>
							{page}
						</button>
					)
				})}
			</div>
		</div>
	)
}
