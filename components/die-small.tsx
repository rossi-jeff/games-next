import Image from 'next/image'

export default function DieSmall({ face }: { face: number }) {
	const src = `/dice/dice-${face}.svg`
	const alt = `Die ${face}`
	return (
		<div className="w-6 h-6" draggable="false">
			<Image src={src} alt={alt} draggable="false" width={50} height={50} />
		</div>
	)
}
