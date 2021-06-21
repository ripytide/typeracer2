import Caret from './Caret.js'

export default function Typer({ words, wordPos, letterPos, opponents }) {
	const Words = words.map((word, i) => {
		const relevantOpps = opponents.filter((opp) => opp.wordPos === i)

		const relevantCarets = relevantOpps.map((opp) => {
			return { nickname: opp.nickname, letterPos: opp.letterPos }
		})

		if (wordPos === i)
			relevantCarets.push({ nickname: 'x', letterPos: letterPos })

		return <Word word={word} caretInfos={relevantCarets} key={i.toString()} />
	})

	return (
		<div className='relative flex flex-wrap justify-start gap-x-1'>{Words}</div>
	)
}

function Word({ word, caretInfos }) {
	const output = word.map((letter, i) => {
		return (
			<Letter
				character={letter.character}
				status={letter.status}
				key={i.toString()}
			/>
		)
	})

	//sort carets into decending order so we can insert them into the letters
	const sortedCarets = caretInfos.sort(
		(firstEl, secondEl) => secondEl.letterPos - firstEl.letterPos
	)

	//instert carets into the letters array
	sortedCarets.forEach((caret) =>
		output.splice(caret.letterPos, 0, <Caret key={caret.nickname} />)
	)

	return <div>{output}</div>
}

function Letter({ character, status }) {
	return (
		<span className={'text-3xl ' + getLetterColor(status)}>{character}</span>
	)
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

