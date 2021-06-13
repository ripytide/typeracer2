import React from 'react';

export default function Switcher({themes}){
	let themeDivs = themes.map((theme) => {
		return(
			<div key={theme.name} data-testid={theme.name}>{theme.name}</div>
		)
	})

	return(
		<div className='w-32 h-12' data-testid='switcher'>
			{themeDivs}
		</div>
	)
}
