import React, {useState} from 'react'

class Typer extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			text: [['h','i','h','g']],
			wordPos: 0,
			letterPos: 0,
		}
	}
			
	componentDidMount(){
		window.addEventListener('keypress', this.KeyPress)
		window.addEventListener('keydown', this.KeyDown)
	}

	KeyPress(e){
		console.log(e.key)
	}

	KeyDown(e){
		if (e.code == 'Backspace'){
			let oldText = this.state.text;
			oldTex
			this.setState({
				text: this.state.text
		}
	}

	render () {
		return (
			<div className='w-full flex flex-col justify-center space-y-4'>
			{this.state.text.map(word => (
					word.map(letter => (
						<letter>
							{letter}
						</letter>
					))
			))}

			</div>
		)
	}
}

function TextArea({text}){
	return (
		<textarea className='bg-transparent'>{text}</textarea>
	)
}

function TypingArea(){
	const [input, setInput] = useState('');

	return (
		<input type="text" value={input} onInput={e => setInput(e.target.value)}/>
	)
}

export default function Home(){
	return(
		<Typer/>
	)
}



