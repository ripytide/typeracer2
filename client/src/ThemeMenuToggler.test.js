import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import ThemeMenuToggler from './ThemeMenuToggler.js'

function pressKey(key) {
	fireEvent.keyDown(window, { key })
}

test('Theme Menu Toggler should not be visible by default', async () => {
	render(<ThemeMenuToggler />)
	const switcher = screen.queryByText('dark')
	expect(switcher).not.toBeInTheDocument()
})

test('Theme Menu Toggler should appear when escape is pressed', async () => {
	render(<ThemeMenuToggler />)
	pressKey('Escape')
	screen.getByText('dark')
})

test('Theme Menu Toggler should not appear when other keys are pressed', async () => {
	render(<ThemeMenuToggler />)
	function testKey(key) {
		pressKey(key)
		let switcher = screen.queryByText('dark')
		expect(switcher).not.toBeInTheDocument()
	}
	testKey('a')
	testKey('Enter')
	testKey('Backspace')
	testKey('x')
})

test('Theme Menu Toggler should toggle in and out of view when escape is pressed', async () => {
	render(<ThemeMenuToggler />)
	pressKey('Escape')
	pressKey('Escape')
	let switcher = screen.queryByText('dark')
	expect(switcher).not.toBeInTheDocument()

	pressKey('Escape')
	switcher = screen.getByText('dark')
	expect(switcher).toBeInTheDocument()
})
