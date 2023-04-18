export default function Home() {
	return (
		<main id="games-home">
			<div className="m-2">
				<h2>Welcome Visitor</h2>
				<div className="mb-4">
					The pages of this site are a collection of games written in
					typescript. They have <a href="https://nestjs.com/">NestJS</a> backend
					and a <a href="https://www.mysql.com/">MySQL</a> database and most
					calculations are performed on the server.
				</div>
				<div className="mb-4">
					The site itself was constructed using the following tools and
					resources:
					<ul>
						<li>
							<a href="https://nextjs.org/">
								NEXT<sub>JS</sub>
							</a>{' '}
							-{' '}
							<i>
								<strong>The React Framework for the Web</strong> Used by some of
								the world&apos;s largest companies, Next.js enables you to
								create full-stack Web applications by extending the latest React
								features, and integrating powerful Rust-based JavaScript tooling
								for the fastest builds.
							</i>{' '}
							(site documentation)
						</li>
						<li>
							<a href="https://tailwindcss.com/">Tailwind CSS</a> -{' '}
							<i>
								A utility-first CSS framework packed with classes like flex,
								pt-4, text-center and rotate-90 that can be composed to build
								any design, directly in your markup.
							</i>{' '}
							(site documentation)
						</li>
						<li>
							Dice images downloaded from <a href="https://css.gg/">CSS.GG</a>
						</li>
						<li>
							Playing Card images downloaded from{' '}
							<a href="https://tekeye.uk/playing_cards/svg-playing-cards">
								Tek Eye
							</a>
						</li>
					</ul>
				</div>
				<div className="mb-4">
					Take some time to play a few games and think about the problem solving
					skills involved in constucting them.
				</div>
				<div className="mb-4">
					The register and sign in dialogs serve two purposes:
					<ul>
						<li>proof of concept for user management</li>
						<li>scores will show a username rather than anonymous</li>
						<li>you may continue some in progress games</li>
					</ul>
					No contact information is collected.
				</div>
				<div className="mb-4">
					The source code for the games site and the backend are available upon
					request.
				</div>
			</div>
		</main>
	)
}
