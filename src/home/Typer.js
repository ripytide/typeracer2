import cloneDeep from 'lodash/cloneDeep'
import React, {useEffect, useReducer} from 'react'
import Caret from './Caret.js'

export default function Typer(props) {
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
	})

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

	return (
		<div className='relative flex flex-wrap justify-start gap-x-1'>
			{state.words.map((word, i) => {
				let isCurrentWord = state.wordPos === i
				return (
					<Word
						word={word}
						key={i.toString()}
						showCaret={isCurrentWord}
						caretPos={isCurrentWord ? state.letterPos : undefined}
					/>
				)
			})}
		</div>
	)
}

function Word({ word, showCaret, caretPos }) {
	return (
		<div>
			{word.map((letter, i) => {
				let colorClass = getLetterColor(letter.status)
				return (
					<>
						{showCaret && caretPos === i ? <Caret /> : null}
						<span className={'text-3xl ' + colorClass} key={i.toString()}>
							{letter.character}
						</span>
					</>
				)
			})}
			{showCaret && caretPos >= word.length ? <Caret /> : null}
		</div>
	)
}

function reducer(oldStateHistory, action) {
	//create a shallow copy for immutability sake and so react does not bail out of re-rendering due to the refernce not changing
	let newHistory = [...oldStateHistory]

	let newState = cloneDeep(newHistory[newHistory.length - 1])

	newState.timeStamp = Date.now()

	switch (action.type) {
		case 'addLetter':
			addLetter(newState, action.character)
			break
		case 'removeLetter':
			removeLetter(newState)
			break
		case 'nextWord':
			nextWord(newState)
			break
		default:
			throw new Error('That is not a vailid action type: ' + action.type)
	}

	newHistory.push(newState)

	return newHistory
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

	if (state.letterPos > 0) {
		if (currWord[state.letterPos - 1].original) {
			currWord[state.letterPos - 1].status = 'untyped'
		} else {
			currWord.pop()
		}

		state.letterPos--
	}

	return state
}

function nextWord(state) {
	if (state.wordPos < state.words.length - 1) {
		state.letterPos = 0
		state.wordPos++
	}
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
