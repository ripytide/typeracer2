import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { themeContext } from './main.js'
import Switcher from './Switcher.js'
import themes from './themes.js'

describe('Switcher', () => {
	it('should contain all the colorschemes', async () => {
		render(<Switcher />)
		for (let themeName in themes) {
			screen.getByText(themeName)
		}
	})

	test('should call changeTheme with the correct theme name', async () => {
		let changeTheme = jest.fn()
		render(
			<themeContext.Provider value={{ changeTheme }}>
				<Switcher />
			</themeContext.Provider>
		)

		fireEvent.click(screen.getByText('dark'))
		expect(changeTheme).toHaveBeenCalledWith('dark')

		fireEvent.click(screen.getByText('light'))
		expect(changeTheme).toHaveBeenCalledWith('light')
	})
})
