import cloneDeep from 'lodash/cloneDeep'
import React, { useEffect, useReducer, useState } from 'react'
import OpponentList from './OpponentList.js'
import Podium from './Podium.js'
import Typer from './Typer.js'

export default function TypingArea({ socket, nickname, room }) {
	//local relevant stuff

	const [typingHistory, dispatch] = useReducer(reducer, [
		{
			words: GetWords('i am a temporary test text'),
			wordPos: 0,
			letterPos: 0,
			timeStamp: Date.now(),
		},
	])

	let typingState = typingHistory[typingHistory.length - 1]

	//useEffect(() => {
	//let onLastLetter =
	//state.letterPos === state.words[state.wordPos].length &&
	//state.wordPos === state.words.length - 1
	//if (onLastLetter) finished(typingHistory)
	//}, [state, typingHistory, finished])

	useEffect(() => {
		//executed when component mounts
		window.addEventListener('keydown', KeyDown)

		//executed when component unmounts
		return () => window.removeEventListener('keydown', KeyDown)

		function KeyDown(e) {
			switch (e.key) {
				case 'Backspace':
					dispatch({ type: 'removeLetter' })
					break
				case ' ':
					dispatch({ type: 'nextWord' })
					break
				default:
					if (isValidCharacter(e.key)) {
						dispatch({ type: 'addLetter', character: e.key })
					}
			}
		}
	}, [])

	const [opponentData, setOpponentData] = useState({
		podium: {
			first: { nickname: '' },
			second: { nickname: '' },
			third: { nickname: '' },
		},
		opponents: [],
	})

	useEffect(() => {
		socket.on('update-out', (oppNickname, oppLetterPos, oppWordPos) => {
			setOpponentData((oldOpponentData) => {
				const newOpponentData = { ...oldOpponentData }
				const opponent = newOpponentData.opponents.find(
					(_opponent) => _opponent.nickname === oppNickname
				)

				if (opponent !== undefined) {
					opponent.letterPos = oppLetterPos
					opponent.wordPos = oppWordPos
				} else {
					newOpponentData.opponents.push({
						nickname: oppNickname,
						letterPos: oppLetterPos,
						wordPos: oppWordPos,
					})
				}

				updatePodium(newOpponentData.podium, newOpponentData.opponents)

				return newOpponentData
			})
		})
	}, [socket])

	useEffect(() => {
		socket.on('opponent-left', (oppNickname) => {
			setOpponentData((oldOppnentData) => {
				const newOpponentData = { ...oldOppnentData }
				const index = newOpponentData.opponents.findIndex(
					(opp) => opp.nickname === oppNickname
				)

				if (index >= 0) newOpponentData.opponents.splice(index, 1)

				return newOpponentData
			})
		})
	}, [socket])

	useEffect(() => {
		socket.on('opponent-data', (opponents) => {
			setOpponentData((oldOpponentData) => {
				const newOpponentData = {...oldOpponentData}
				newOpponentData.opponents = opponents
				updatePodium(newOpponentData.podium, opponents)
				return newOpponentData
			})
		})
	}, [socket])

	useEffect(() => {
		socket.emit('update-in', typingState.letterPos, typingState.wordPos)
	}, [typingState, socket])

	return (
		<>
			<Typer
				words={typingState.words}
				letterPos={typingState.letterPos}
				wordPos={typingState.wordPos}
				opponents={opponentData.opponents}
			/>
			<OpponentList opponents={opponentData.opponents} />
			<Podium
				first={opponentData.podium.first}
				second={opponentData.podium.second}
				third={opponentData.podium.third}
			/>
		</>
	)
}

function reducer(oldStateHistory, action) {
	if (canDoAction(oldStateHistory[oldStateHistory.length - 1], action)) {
		let newHistory = [...oldStateHistory]
		let newState = cloneDeep(newHistory[newHistory.length - 1])
		newState.timeStamp = Date.now()

		doAction(newState, action)
		newHistory.push(newState)

		return newHistory
	} else {
		return oldStateHistory
	}
}

function canDoAction(state, action) {
	switch (action.type) {
		case 'addLetter':
			return isValidCharacter(action.character)
		case 'removeLetter':
			return state.letterPos > 0
		case 'nextWord':
			return state.wordPos < state.words.length - 1
		default:
			throw new Error(`Not a valid actionType: ${action}`)
	}
}

function doAction(state, action) {
	switch (action.type) {
		case 'addLetter':
			return addLetter(state, action.character)
		case 'removeLetter':
			return removeLetter(state)
		case 'nextWord':
			return nextWord(state)
		default:
			throw new Error(`invalid action type: ${action.type}`)
	}
}

function addLetter(state, character) {
	let currWord = state.words[state.wordPos] //get a reference to the currentWord

	if (state.letterPos < currWord.length) {
		let currCharacter = currWord[state.letterPos] //also a reference

		if (character === currCharacter.character) {
			currCharacter.status = 'valid'
		} else {
			currCharacter.status = 'invalid'
		}
	} else {
		currWord.push({
			original: false,
			character,
			status: 'invalid',
		})
	}
	state.letterPos++
	return state
}

function removeLetter(state) {
	let currWord = state.words[state.wordPos]

	if (currWord[state.letterPos - 1].original) {
		currWord[state.letterPos - 1].status = 'untyped'
	} else {
		currWord.pop()
	}
	state.letterPos--
	return state
}

function nextWord(state) {
	state.letterPos = 0
	state.wordPos++
	return state
}

function GetWords(txt) {
	let output = []
	let currWord = []

	for (let i = 0, len = txt.length; i < len; i++) {
		if (txt[i] === ' ') {
			output.push(currWord)
			currWord = []
		} else {
			currWord.push({
				original: true,
				character: txt[i],
				status: 'untyped',
			})
		}
	}
	output.push(currWord)
	return output
}

function updatePodium(podium, opponents) {
	const sortedOpponents = opponents.sort((opp1, opp2) => {
		if (opp1.wordPos > opp2.wordPos) {
			return -1
		} else if (opp2.wordPos > opp1.wordPos) {
			return 1
		} else {
			if (opp1.letterPos > opp2.letterPos) {
				return -1
			} else {
				return 1
			}
		}
	})

	if (sortedOpponents[0]) {
		podium.first = sortedOpponents[0]
	}
	if (sortedOpponents[1]) {
		podium.second = sortedOpponents[1]
	}
	if (sortedOpponents[2]) {
		podium.third = sortedOpponents[2]
	}
}

function isValidCharacter(character) {
	let validCharacters = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
	]
	return validCharacters.includes(character)
}
