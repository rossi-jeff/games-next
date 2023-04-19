'use client'

import { ArgsUserCredential } from '@/types/args-user-credential.type'
import { useState } from 'react'

export default function CredentialsForm({
	label,
	id,
	submit,
	cancel,
}: {
	label: string
	id: string
	submit: Function
	cancel: Function
}) {
	const [credentials, setCredentials] = useState<ArgsUserCredential>({
		UserName: '',
		password: '',
	})

	const fieldChanged = (event: any) => {
		const { name, value } = event.target
		const current = { ...credentials }
		if (name == 'user-name') {
			current.UserName = value
		} else {
			current.password = value
		}
		setCredentials(current)
	}

	const onClick = () => {
		submit(credentials)
	}
	return (
		<div className="modal-content" id={id}>
			<div className="modal-header">{label}</div>
			<div className="mx-2 mb-3">
				<label htmlFor="user-name">User Name</label>
				<input
					type="text"
					name="user-name"
					onChange={fieldChanged}
					defaultValue={credentials.UserName}
				/>
			</div>
			<div className="mx-2 mb-3">
				<label htmlFor="pass-word">Pass Word</label>
				<input
					type="password"
					name="pass-word"
					onChange={fieldChanged}
					defaultValue={credentials.password}
				/>
			</div>
			<div className="mx-2 flex flex-wrap justify-between">
				<button onClick={() => cancel()}>Cancel</button>
				<button onClick={onClick}>{label}</button>
			</div>
		</div>
	)
}
