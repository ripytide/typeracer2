import React from 'react';
import {screen, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RoomChooser from './RoomChooser.js'

test("availible rooms shown", () => {
	render(<RoomChooser/>)
	screen.getByRole('button', {name: 'room 1'})
	screen.getByRole('button', {name: 'room 2'})
	screen.getByRole('button', {name: 'room 3'})
})

test("when room is clicked1", () => {
	let mock = jest.fn()
	render(<RoomChooser callback={mock}/>)
	const room1 = screen.getByRole('button', {name: 'room 1'})
	userEvent.click(room1)

	expect(mock).toHaveBeenCalledWith('room1')
})
