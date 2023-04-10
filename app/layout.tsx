import Link from 'next/link'
import './globals.css'

export const metadata = {
	title: 'Games by Jeff Rossi',
	description: 'Collection of online games written in TypeScript',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<nav>
					<Link href="/">Home</Link>
					<Link href="/yacht">Yacht</Link>
					<Link href="/guessword">Guess Word</Link>
					<Link href="/codebreaker">Code Breaker</Link>
				</nav>
				{children}
			</body>
		</html>
	)
}
