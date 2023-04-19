'use client'

import { SessionData } from '../lib/session-storage'

export default function SessionButtons({
	session,
	signOut,
	showSignIn,
	showRegister,
}: {
	session: SessionData
	signOut: Function
	showSignIn: Function
	showRegister: Function
}) {
	return session && session.SignedIn === true ? (
		<>
			<strong className="mr-2">{session.UserName}</strong>
			<button onClick={() => signOut()}>Sign Out</button>
		</>
	) : (
		<>
			<button onClick={() => showSignIn()}>Sign In</button>
			<button className="ml-2" onClick={() => showRegister()}>
				Register
			</button>
		</>
	)
}
