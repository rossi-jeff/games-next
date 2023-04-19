type StorageType = 'local' | 'session'

export const sessionKey = 'rossi-games-session'

export type SessionData = {
	UserName: string | null
	Token: string | null
	SignedIn: boolean
}

export const blankSession: SessionData = {
	UserName: null,
	Token: null,
	SignedIn: false,
}

type StorageReturnValue = {
	getItem: (key: string, type?: StorageType) => SessionData
	setItem: (key: string, value: SessionData, type?: StorageType) => boolean
	removeItem: (key: string, type?: StorageType) => void
}

const useStorage = (): StorageReturnValue => {
	const storageType = (
		type?: StorageType
	): 'localStorage' | 'sessionStorage' => {
		return `${type || 'session'}Storage`
	}

	const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()

	const getItem = (key: string, type?: StorageType): SessionData => {
		const strData = isBrowser
			? window[storageType(type)][key]
			: JSON.stringify(blankSession)
		const data: SessionData = strData ? JSON.parse(strData) : blankSession
		return data
	}

	const setItem = (key: string, value: SessionData, type?: StorageType) => {
		if (isBrowser) {
			window[storageType(type)][key] = JSON.stringify(value)
			return true
		}
		return false
	}

	const removeItem = (key: string, type?: StorageType) => {
		window[storageType(type)].removeItem(key)
	}

	return { getItem, setItem, removeItem }
}

export default useStorage
