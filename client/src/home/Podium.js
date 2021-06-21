import React from 'react';

export default function Podium({first, second, third}){
	return(
		<>
		<h1>Podium:</h1>
		<ol>
			<li>{first.nickname}</li>
			<li>{second.nickname}</li>
			<li>{third.nickname}</li>
		</ol>
		</>
	)
}
