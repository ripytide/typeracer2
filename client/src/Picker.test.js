import React from 'react';
import {screen, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Picker from './Picker.js'

test("correct items shown", () => {
	render(<Picker items={['item 1', 'itemssss 2', 'aha 4']}/>)
	screen.getByRole('button', {name: 'item 1'})
	screen.getByRole('button', {name: 'itemssss 2'})
	screen.getByRole('button', {name: 'aha 4'})
})

test("calls the callback with the correct value", () => {
	let mock = jest.fn()
	render(<Picker items={['itemy 1']} callback={mock}/>)
	const item = screen.getByRole('button', {name: 'itemy 1'})
	userEvent.click(item)

	expect(mock).toHaveBeenCalledWith('itemy 1')
})
