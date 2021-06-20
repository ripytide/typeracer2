import React, {useState, useEffect} from 'react';
import Picker from './Picker.js'
import themes from './Themes.json'

export default function SwitcherToggler(){
	const [shown, setShown] = useState(false)

	useEffect(() => {
		const KeyDown = (e) => {
			if (e.key === 'Escape'){
				setShown((s) => !s)
			}
		}
		window.addEventListener('keydown', KeyDown)
		return(() => {window.removeEventListener('keydown', KeyDown)})
	}, [])

	if (shown) {
		return <Picker items={themes.map((theme) => theme.name)} callback={() => undefined}/>
	} else {
		return null
	}
}
