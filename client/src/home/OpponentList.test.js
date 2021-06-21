import React from 'react'
import { render, screen } from '@testing-library/react'
import OpponentList from './OpponentList.js'

test('should render list of given opponents', () => {
	render(
		<OpponentList
			opponents={[
				{ nickname: 'test1' },
				{ nickname: 'test2' },
				{ nickname: 'test3' },
				{ nickname: 'test4' },
			]}
		/>
	)

	screen.getByText('Opponents:')
	screen.getByText('test1')
	screen.getByText('test2')
	screen.getByText('test3')
	screen.getByText('test4')
})
