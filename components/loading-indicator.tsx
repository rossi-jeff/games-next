import { FaSpinner } from 'react-icons/fa'

export default function LoadingIndicator() {
	return (
		<div className="loading-indicator">
			<div className="loading-content">
				<FaSpinner />
				<h2>Loading...</h2>
			</div>
		</div>
	)
}
