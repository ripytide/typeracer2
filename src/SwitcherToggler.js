import React, {useState, useEffect} from 'react';
import Switcher from './Switcher.js'

export default function SwitcherToggler(){
	const [shown, setShown] = useState(false)

	useEffect(() => {
		let KeyDown = (e) => {
			if (e.key === 'Escape'){
				setShown((s) => !s)
			}
		}
		window.addEventListener('keydown', KeyDown)
		return(() => {window.removeEventListener('keydown', KeyDown)})
	}, [])

	if (shown) {
		return <Switcher/>
	} else {
		return null
	}
}
