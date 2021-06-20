import React, { useState, useEffect } from 'react'
import Typer from './Typer.js'
import Picker from '../Picker.js'
import io from 'socket.io-client'
import config from '../config.json'
import TextInput from '../TextInput.js'

export default function MainArea() {
	const [typing, setTyping] = useState(true)

	const [WPM, setWPM] = useState(0)

	const [room, setRoom] = useState(undefined)

	const [nickname, setNickname] = useState(undefined)

	const [nicknameAttempted, setNicknameAttempted] = useState(false)

	const [socket, setSocket] = useState(undefined)

	useEffect(() => {
		setSocket(io(config.ENDPOINT))
	}, [])

	if (!socket) {
		return <h1>Connecting...</h1>
	} else if (!nickname) {
		return (
			<TextInput
				label='Nickname:'
				callback={(nick) => {
					setNicknameAttempted(true)
					socket.emit('register', nick, (result) => {
						if (result) setNickname(nick)
					})
				}}
				errorMsg={
					nicknameAttempted ? 'Invalid username, please try again.' : null
				}
			/>
		)
	} else if (!room) {
		return (
			<Picker
				items={['room 1', 'room 2']}
				callback={(room) => {
					setRoom(room)
					socket.emit('join', room)
				}}
			/>
		)
	} else if (typing && socket) {
		return (
			<Typer
				text='i am a fast boiiii as fuck boiii'
				finished={(stateHistory) => {
					setWPM(calcWPM(stateHistory))
					setTyping(false)
				}}
				socket={socket}
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
