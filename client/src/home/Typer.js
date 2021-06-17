import cloneDeep from 'lodash/cloneDeep'
import React, { useEffect, useReducer, useState } from 'react'
import Caret from './Caret.js'
import io from 'socket.io-client'
import config from '../config.json'

export default function Typer(props) {
	//local relevant stuff

	//required props are text:string and finished:callback_function
	const [stateHistory, dispatch] = useReducer(reducer, [
		{
			words: GetWords(props.text),
			wordPos: 0,
			letterPos: 0,
			timeStamp: Date.now(),
		},
	])

	let state = stateHistory[stateHistory.length - 1]

	useEffect(() => {
		let onLastLetter =
			state.letterPos === state.words[state.wordPos].length &&
			state.wordPos === state.words.length - 1
		if (onLastLetter) props.finished(stateHistory)
	}, [state, stateHistory, props])

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
	}, [props.finished])

	//multiplayer relevant stuff
	const [socket] = useState(() => io(config.ENDPOINT))
	const [opponents, setOpponents] = useState([])

	useEffect(() => {
		socket.emit('update-in', props.nickname, state.letterPos, state.wordPos)
	}, [state, socket])

	useEffect(() => {
		socket.emit('join', props.roomId)
		socket.on('update-out', (oppLetterPos, oppWordPos) => {
			console.log('update recieved');
			setOpponents((oldOppenets) => {
				const newOpponents = [...oldOppenets]
				let index = newOpponents.find((opp) => opp.nickname === oppNickname)

				if (index !== undefined) {
					newOpponents[index].letterPos = oppLetterPos
					newOpponents[index].wordPos = oppWordPos
				} else {
					newOpponents.push({
						nickname: oppNickname,
						letterPos: oppLetterPos,
						wordPos: oppWordPos,
					})
				}
				return newOpponents
			})
		})
	}, [socket, props.roomId])

	return (
		<div className='relative flex flex-wrap justify-start gap-x-1'>
			{state.words.map((word, i) => {
				const relevantOpps = opponents.filter((opp) => opp.wordPos === i)
				const relevantCarets = relevantOpps.map((opp) => {
					return { letterPos: opp.letterPos }
				})

				if (state.wordPos === i)
					relevantCarets.push({ letterPos: state.letterPos })

				return (
					<Word word={word} caretInfos={relevantCarets} key={i.toString()} />
				)
			})}
		</div>
	)
}

function Word({ word, caretInfos }) {
	return (
		<div>
			{word.map((letter, i) => {
				let colorClass = getLetterColor(letter.status)
				return (
					<>
						{caretInfos
							.filter((caret) => caret.letterPos === i)
							.map((caret) => (
								<Caret />
							))}
						<span className={'text-3xl ' + colorClass} key={i.toString()}>
							{letter.character}
						</span>
					</>
				)
			})}
			{caretInfos
				.filter((caret) => caret.letterPos >= word.length)
				.map((caret) => (
					<Caret />
				))}
		</div>
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

function getLetterColor(status) {
	let colorClass
	switch (status) {
		case 'untyped':
			colorClass = 'text-blue-400'
			break
		case 'valid':
			colorClass = 'text-green-400'
			break
		case 'invalid':
			colorClass = 'text-red-400'
			break
		default:
	}

	return colorClass
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
