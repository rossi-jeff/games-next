'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type LinkType = { path: string; text: string }

export default function NavBar() {
	const links: LinkType[] = [
		{ path: '/yacht', text: 'Yacht' },
		{ path: '/guessword', text: 'Guess Word' },
		{ path: '/codebreaker', text: 'Code Breaker' },
		{ path: '/freecell', text: 'Free Cell' },
		{ path: '/klondike', text: 'Klondike' },
		{ path: '/seabattle', text: 'Sea Battle' },
		{ path: '/hangman', text: 'Hang Man' },
		{ path: '/concentration', text: 'Concentration' },
		{ path: '/tengrand', text: 'Ten Grand' },
	]
	const pathName = usePathname()
	return (
		<nav id="nav-bar">
			<Link href="/" className={pathName == '/' ? 'active' : ''}>
				Home
			</Link>
			{links.map((link, index) => (
				<Link
					key={index}
					href={link.path}
					className={pathName.match(link.path) ? 'active' : ''}
				>
					{link.text}
				</Link>
			))}
		</nav>
	)
}
