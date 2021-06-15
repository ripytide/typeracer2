import React from 'react';
import {render, screen} from '@testing-library/react'
import App from './main.js'

describe('Main App', () => {
	test('App should render', () => {
		render(<App/>)
		const app = screen.getByTestId('app')
		expect(app).toBeVisible()
	})
})
