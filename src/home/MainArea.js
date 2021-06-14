import React, { useState } from 'react'
import Typer from './Typer.js'

export default function MainArea(props) {
	const [typing, setTyping] = useState(true)
	const [WPM, setWPM] = useState(0)

	if (typing) {
		return (
			<Typer
				text='i am a fast boiiii as fuck boiii'
				finished={(stateHistory) => {
					setWPM(calcWPM(stateHistory))
					setTyping(false)
				}}
			/>
		)
	} else {
		return <h1>WPM: {WPM} this is a test</h1>
	}
}

function calcWPM(stateHistory) {
	let startTime = stateHistory[0].timeStamp
	let endTime = stateHistory[stateHistory.length - 1].timeStamp

	let timeTaken = endTime - startTime

	let wordCount = stateHistory[0].words.length

	return Math.floor((wordCount * 60) / (timeTaken / 1000))
}
