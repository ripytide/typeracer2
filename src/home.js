import React, { useState, useEffect } from "react";

function Typer(props) {
	const [state, setState] = useState({
		words: GetWords(props.text),
		wordPos: 0,
		letterPos: 0,
	});

	useEffect(() => {
		//executed when component mounts
		window.addEventListener("keydown", KeyDown);

		//executed when component unmounts
		return () => window.removeEventListener("keydown", KeyDown);

		function KeyDown(e) {
			if (isValidCharacter(e.key)) {
				TypeCharacter(e.key);
			} else if (e.key === "Backspace") {
				DeleteCharacter();
			}
		}
	}, []);

	return (
		<div className="flex flex-wrap justify-start gap-x-1">
			{state.words.map((word, i) => {
				return <Word word={word} key={i.toString()} />;
			})}
		</div>
	);

	function TypeCharacter(character) {
		console.log("key hit: " + character);
		setState((oldState) => {
			//os is short for old state
			let currWord = oldState.words[oldState.wordPos]; //get a reference to the currentWord

			if (oldState.letterPos < currWord.length) {
				let tempCharacter = currWord[oldState.letterPos];

				if (character === tempCharacter.character) {
					tempCharacter.status = "valid";
				} else {
					tempCharacter.status = "invalid";
				}

				currWord[oldState.letterPos] = tempCharacter;
			} else {
				currWord.push({
					original: false,
					character,
					status: "invalid",
				});
			}

			let newState = { ...oldState };
			//this next line is unneccecary as arrays are reference types
			newState.words[oldState.wordPos] = currWord;

			newState.letterPos++;

			return newState;
		});
	}

	function DeleteCharacter() {
		console.log('Deleting Character');
	}

	function GetWords(txt) {
		let output = [];
		let currWord = [];

		for (let i = 0, len = txt.length; i < len; i++) {
			if (txt[i] === " ") {
				output.push(currWord);
				currWord = [];
			} else {
				currWord.push({
					original: true,
					character: txt[i],
					status: "untyped",
				});
			}
		}
		return output;
	}

	function isValidCharacter(character) {
		let validCharacters = [
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
			"M",
			"N",
			"O",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"U",
			"V",
			"W",
			"X",
			"Y",
			"Z",
		];
		return validCharacters.includes(character);
	}
}

function Word({ word }) {
	return (
		<div>
			{word.map((letter, i) => (
				<letter className='text-3xl' key={i.toString()}>{letter.character}</letter>
			))}
		</div>
	);
}

export default function Home() {
	return (
		<Typer text='this is the testy text and it is about to become very long lol that is so cool i wish i was that cool like josh blake is that cool i think if he isn"t lying to me' />
	);
}
