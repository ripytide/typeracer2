import React from 'react'
import { render, screen } from '@testing-library/react'
import Podium from './Podium.js'

test('should render list of given opponents', () => {
	render(
		<Podium
			first={{ nickname: 'bob' }}
			second={{ nickname: 'bill' }}
			third={{ nickname: 'timmy' }}
		/>
	)

	screen.getByText('Podium:')
	screen.getByText('bob')
	screen.getByText('bill')
	screen.getByText('timmy')
})
