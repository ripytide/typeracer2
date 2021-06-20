import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import TextInput from './TextInput.js'

test('should return entered text', () =>{
	let mock = jest.fn()
	render(<TextInput label={'username'} callback={mock}/>)

	let input = screen.getByLabelText('username')

	const testValue = 'boobyyesht'

	userEvent.type(input, testValue)

	expect(input).toHaveValue(testValue)

	userEvent.type(input, '{enter}')

	expect(mock).toHaveBeenCalledWith(testValue)
})

test('error msg should be displayed in red text', () =>{
	const error = 'error this message should be displayed on the component'
	render(<TextInput label='testing123' errorMsg={error} callback={()=>{return}}/>)

	let input = screen.getByLabelText('testing123')

	const errorMsg = screen.getByText(error)

	expect(errorMsg).toBeInTheDocument()

	expect(errorMsg).toHaveStyle({color: "red"})
})
