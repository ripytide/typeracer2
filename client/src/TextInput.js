import React, { useState } from 'react'

export default function TextInput({ label, callback, errorMsg }) {
	const [text, setText] = useState('')

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				callback(text)
			}}
		>
			<label htmlFor={'textInput'}>{label}</label>
			<input
				type='text'
				id='textInput'
				onChange={(e) => setText(e.target.value)}
			/>
			<p style={{ color: 'red' }}>{errorMsg}</p>
		</form>
	)
}
