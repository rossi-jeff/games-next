import Image from 'next/image'

export default function DieLarge({
	face,
	index,
	heading,
	draggable,
}: {
	face: number
	index: number
	heading: string
	draggable: boolean
}) {
	const src = `/dice/dice-${face}.svg`
	const alt = `Die ${face}`
	const id = `${face}_${index}_${heading.replace(' ', '-')}`
	return (
		<div className="w-16 h-16" draggable={draggable} id={id}>
			<Image src={src} alt={alt} draggable="false" width={100} height={100} />
		</div>
	)
}
