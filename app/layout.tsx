import './globals.css'
import NavBar from './nav-bar'

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
				<NavBar />
				{children}
			</body>
		</html>
	)
}
