import { SessionData } from './session-storage'

export const buildRequestHeaders = (session?: SessionData) => {
	const headers: { [key: string]: string } = {}
	headers['Content-Type'] = 'application/json'
	headers['Accept'] = 'application/json'
	if (session && session.Token) {
		headers['Authorization'] = `Bearer ${session.Token}`
	}
	console.log(headers)
	return headers
}
