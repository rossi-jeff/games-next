import { TenGrand } from '../../../types/ten-grand.type'

export default function TenGrandScoreRow({
	ten_grand,
}: {
	ten_grand: TenGrand
}) {
	return (
		<div className="flex flex-wrap px-2 justify-between">
			<div>{ten_grand.id}</div>
			<div>{ten_grand.user ? ten_grand.user.UserName : 'Anonymous'}</div>
			<div>{ten_grand.Status}</div>
			<div>{ten_grand.Score}</div>
		</div>
	)
}
