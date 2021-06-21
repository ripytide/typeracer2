import React from 'react'
export default function OpponentList({ opponents }) {
	return (
		<>
		<h1>Opponents:</h1>
		<ul>
			{opponents.map((opponent) => (
				<Opponent opponent={opponent} key={opponent.nickname} />
			))}
		</ul>
		</>
	)
}

function Opponent({opponent}) {
	return (
		<li>
			<h3>{opponent.nickname}</h3>
		</li>
	)
}
