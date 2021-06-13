import React from 'react';
import {act} from 'react-dom/test-utils'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {enableFetchMocks, resetMocks} from 'jest-fetch-mock'
import SwitcherToggler from './SwitcherToggler.js'

function pressKey(key) {
	fireEvent.keyDown(window, {key})
}

describe('Theme Switcher', () => {
	beforeEach(() => {
		enableFetchMocks()
		resetMocks()
		fetch.mockResponse(JSON.stringify([{name: "dark"}]))
	})
	test("Theme switcher should not be visible by default", async () => {
		await act(async () => {render(<SwitcherToggler/>)})
		const switcher = screen.queryByTestId('switcher')
		expect(switcher).not.toBeInTheDocument()
	})

	test('Theme switcher should appear when escape is pressed', async () => {
		await act(async () => {render(<SwitcherToggler/>)})
		pressKey("Escape")
		await waitFor(() => screen.getByTestId('switcher'))
	})

	test('Theme switcher should not appear when other keys are pressed', async () => {
		await act(async () => {render(<SwitcherToggler/>)})
		function testKey(key) {
			pressKey(key)
			let switcher = screen.queryByTestId('switcher')
			expect(switcher).not.toBeInTheDocument()
		}
		testKey('a')
		testKey('Enter')
		testKey('Backspace')
		testKey('x')
	})

	test('Theme switcher should toggle in and out of view when escape is pressed', async () => {
		await act(async () => {render(<SwitcherToggler/>)})
		pressKey("Escape")
		pressKey("Escape")
		let switcher = screen.queryByTestId('switcher')
		expect(switcher).not.toBeInTheDocument()

		pressKey("Escape")
		switcher = await screen.findByTestId('switcher')
		expect(switcher).toBeInTheDocument()
	})
	test("Theme switcher should contain dark theme option", async () => {
		await act(async () => {render(<SwitcherToggler/>)})
		pressKey("Escape")
		let darkTheme = await screen.findByTestId("dark")
		expect(darkTheme).toBeInTheDocument()
	})

	test ("background style should change when dark mode clicked", async () => {
		expect(true).toBe(false)
	})
})
