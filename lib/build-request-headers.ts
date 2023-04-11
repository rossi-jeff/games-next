export const buildRequestHeaders = () => {
	const headers: Headers = new Headers()
	headers.append('Content-Type', 'application/json')
	headers.append('Accept', 'application/json')
	return headers
}
