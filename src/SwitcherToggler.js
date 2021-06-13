import React, {useState, useEffect} from 'react';
import Switcher from './Switcher.js'

export default function SwitcherToggler(){
	const [themes, setThemes] = useState(null)
	const [shown, setShown] = useState(false)

	useEffect(() => {
		fetch('/Themes.json', {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
			.then((response) => {
				return response.json()
			})
			.then((themes) => {
				setThemes(themes)
			})
	}, [])

	useEffect(() => {
		let KeyDown = (e) => {
			if (e.key === 'Escape'){
				setShown((s) => !s)
			}
		}
		window.addEventListener('keydown', KeyDown)
		return(() => {window.removeEventListener('keydown', KeyDown)})
	})

	if (shown) {
		if (themes) {
			return <Switcher themes={themes}/>
		} else {
			return <div>loading</div>
		}
	}
	else {
		return null
	}
}
