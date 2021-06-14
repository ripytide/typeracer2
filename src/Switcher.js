import React, { useContext } from 'react'
import { themeContext } from './main.js'
import themes from './themes.js'

export default function Switcher() {
	const Theme = useContext(themeContext)

	let themeDivs = []
	for (let themeName in themes) {
		themeDivs.push(
			<div key={themeName} onClick={() => Theme.changeTheme(themeName)}>
				{themeName}
			</div>
		)
	}

	return (
		<div className='w-32 h-12' data-testid='switcher'>
			{themeDivs}
		</div>
	)
}
